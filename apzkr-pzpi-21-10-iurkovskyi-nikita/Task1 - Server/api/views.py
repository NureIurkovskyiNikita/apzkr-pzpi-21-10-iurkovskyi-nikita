from rest_framework import generics, viewsets
from django.http import HttpResponse
from django.views import View
from rest_framework.parsers import MultiPartParser
from django.db.models import Count

import api.models as models
import api.serializers as serializers
import api.database_tools as database_tools
from collections import defaultdict
import os
from json import dumps, load
from datetime import date, datetime
from collections import defaultdict
import serial


class CateringEstablishmentViewSet(viewsets.ModelViewSet):
    queryset = models.CateringEstablishment.objects.all()
    serializer_class = serializers.CateringEstablishmentSerializer


class DishViewSet(viewsets.ModelViewSet):
    queryset = models.Dish.objects.all()
    serializer_class = serializers.DishSerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = models.Ingredient.objects.all()
    serializer_class = serializers.IngredientSerializer


class DishIngredientViewSet(viewsets.ModelViewSet):
    queryset = models.DishIngredient.objects.all()
    serializer_class = serializers.DishIngredientSerializer


class AutomaticMachineTypeViewSet(viewsets.ModelViewSet):
    queryset = models.AutomaticMachineType.objects.all()
    serializer_class = serializers.AutomaticMachineTypeSerializer


class CateringEstablishmentAutomaticMachineViewSet(viewsets.ModelViewSet):
    queryset = models.AutomaticMachineType.objects.all()
    serializer_class = serializers.AutomaticMachineTypeSerializer


class AutomaticMachineDishViewSet(viewsets.ModelViewSet):
    queryset = models.AutomaticMachineDish.objects.all()
    serializer_class = serializers.AutomaticMachineDishSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


class DishReportViewSet(viewsets.ModelViewSet):
    queryset = models.DishReport.objects.all()
    serializer_class = serializers.DishReportSerializer


class AppropriateDishesWithIngredientsList(
    generics.ListCreateAPIView):
    serializer_class = serializers.AppropriateDishesSerializer

    def get_queryset(self):
        ingredient_key = '0'
        missed_parameter_key = '1'
        query_parameters = self.request.query_params
        missed_count_parameter_list = \
            list(query_parameters.getlist(missed_parameter_key))
        missed_count_parameter = \
            int(missed_count_parameter_list[0]) \
                if len(missed_count_parameter_list) >= 1 else 0
        parameter_set = \
            set(map(int, list(
                query_parameters.getlist(ingredient_key))))

        return get_dishes_with_ingredients(
            parameter_set, missed_count_parameter)


def get_dishes_with_ingredients(
        ingredients: set,
        acceptable_missed_count: int) -> dict:
    dishes = [dish.id for dish in models.Dish.objects.all()]
    appropriate_dishes = list()
    almost_appropriate_dishes = list()

    for dish_id in dishes:
        dish_ingredients = {
            item.ingredient_id for item in
            models.DishIngredient.objects.filter(dish=dish_id)}
        print(dish_ingredients)
        not_used_ingredients = \
            dish_ingredients.difference(ingredients)
        not_used_ingredients_count = len(not_used_ingredients)
        if not_used_ingredients_count == 0:
            appropriate_dishes.append(dish_id)
        elif not_used_ingredients_count <= acceptable_missed_count:
            almost_appropriate_dishes.append(dish_id)

    return (
        models.Dish.objects.filter(
            id__in=appropriate_dishes),
        models.Dish.objects.filter(
            id__in=almost_appropriate_dishes))


class CateringEstablishmentDishList(generics.ListAPIView):
    queryset = ''
    request = \
        'SELECT		    DISTINCT api_dish.* ' \
        'FROM   		api_cateringestablishment ' \
        'INNER JOIN 	api_cateringestablishmentautomaticmachine ' \
        'ON 			api_cateringestablishment.id = ' \
        '			    api_cateringestablishmentautomaticmachine.catering_establishment_id ' \
        'INNER JOIN 	api_automaticmachinetype ' \
        'ON 			api_cateringestablishmentautomaticmachine.automatic_machine_type_id = ' \
        '			    api_automaticmachinetype.id ' \
        'INNER JOIN 	api_automaticmachinedish ' \
        'ON 			api_automaticmachinetype.id = ' \
        '			    api_automaticmachinedish.automatic_machine_type_id ' \
        'INNER JOIN 	api_dish ' \
        'ON 			api_automaticmachinedish.dish_id = api_dish.id ' \
        'WHERE          api_cateringestablishment.id = {}'

    def get(self, request, *args, **kwargs):
        dishes = []
        return database_tools.executeRequest(
            CateringEstablishmentDishList.request.format(kwargs['pk']),
            database_tools.save_response_data_to_list,
            dishes,
            'GET')


class DishSetCateringEstablishments(
        generics.ListAPIView):
    serializer_class = \
        serializers.CateringEstablishmentSerializer

    def get_queryset(self):
        query_parameters = self.request.query_params

        dish_key = 'dish'
        wish_list = set(map(int, list(
            query_parameters.getlist(dish_key))))

        automated_machines_with_given_dishes = \
            models.AutomaticMachineDish.objects.filter(
                dish__in=wish_list
            )
        automated_machines_types_with_given_dishes = \
            automated_machines_with_given_dishes. \
            values_list('automatic_machine_type')
        dishes_cooked_by_machines = \
            automated_machines_with_given_dishes.\
            values_list('dish')

        machine_type_appropriate_dishes = \
            get_list_mapped_to_integer(
                automated_machines_types_with_given_dishes,
                dishes_cooked_by_machines)

        catering_establishment_machines = \
            get_catering_establishment_machines(
                automated_machines_types_with_given_dishes)

        catering_establishments_that_cook_given_dishes = \
            get_catering_establishments_that_cook_given_dishes(
                machine_type_appropriate_dishes,
                catering_establishment_machines, wish_list)

        searched_catering_establishments = \
            models.CateringEstablishment.objects.filter(
                id__in=
                catering_establishments_that_cook_given_dishes)
        searched_catering_establishments = \
            choose_catering_establishment_by_location(
                query_parameters,
                searched_catering_establishments)

        return searched_catering_establishments


class RequestedCatalogData(generics.ListAPIView):
    serializer_class = serializers.DishSerializer

    def get_queryset(self):
        received_parameters = self.request.query_params
        types, popularity, min_rate, max_rate, name_substring = \
            self.parse_params(received_parameters)
        filter_dict = self.get_filter_dict(
            types, popularity, min_rate, max_rate, name_substring
        )
        return models.Dish.objects.filter(**filter_dict)

    def parse_params(self, params):
        types = params.getlist('0')
        popularity = params.getlist('1')
        min_rate = int(params.get('2')) if params.get('2') else 0
        max_rate = int(params.get('3')) if params.get('3') else 0
        name_substring = params.get('4') if params.get('4') else ''
        return types, popularity, min_rate, max_rate, name_substring

    def get_filter_dict(self, types, popularity,
                        min_rate, max_rate, name_substring):
        filter_params = dict()
        if types:
            filter_params['type__in'] = types
        if popularity:
            filter_params['popularity__in'] = popularity
        if min_rate:
            filter_params['rate__gte'] = min_rate
        if max_rate:
            filter_params['rate__lte'] = max_rate
        if name_substring:
            filter_params['name__icontains'] = name_substring
        return filter_params


def get_list_mapped_to_integer(keys, values):
    result_dict = defaultdict(set)

    for k in range(len(keys)):
        result_dict[keys[k][0]].add(values[k][0])

    return result_dict


def get_catering_establishment_machines(
        automated_machines_types_with_given_dishes):
    machines_that_cook_given_dishes = \
        models.CateringEstablishmentAutomaticMachine.objects.filter(
            automatic_machine_type__in=automated_machines_types_with_given_dishes)
    appropriate_catering_establishments = \
        machines_that_cook_given_dishes.values_list('catering_establishment')
    appropriate_machines = \
        machines_that_cook_given_dishes.values_list('automatic_machine_type')
    return get_list_mapped_to_integer(
        appropriate_catering_establishments, appropriate_machines)


def get_catering_establishments_that_cook_given_dishes(
        machine_type_dishes, catering_establishment_machines, wish_list):
    appropriate_catering_establishments = list()

    for catering_establishment, machines in \
            catering_establishment_machines.items():
        catering_establishment_dishes = set()
        for machine in machines:
            catering_establishment_dishes = \
                catering_establishment_dishes.union(machine_type_dishes[machine])
        if catering_establishment_dishes == wish_list:
            appropriate_catering_establishments.append(catering_establishment)

    return appropriate_catering_establishments


def choose_catering_establishment_by_location(params, catering_establishments):
    street_list = params.getlist('street')
    city_list = params.getlist('city')
    country_list = params.getlist('country')

    if street_list:
        if appropriate_catering_establishments := \
                catering_establishments.filter(street__exact=street_list[0]):
            return appropriate_catering_establishments

    if city_list:
        if appropriate_catering_establishments := \
                catering_establishments.filter(city__exact=city_list[0]):
            return appropriate_catering_establishments

    if country_list:
        if appropriate_catering_establishments := \
                catering_establishments.filter(country__exact=country_list[0]):
            return appropriate_catering_establishments

    return catering_establishments


class FiltrationParamsView(View):

    def get(self, request, *args, **kwargs):
        dish_types = list(models.Dish.objects.\
                          values_list('type', flat=True).distinct())
        dish_popularity = list(models.Dish.objects.
                               values_list('popularity', flat=True).distinct())
        if '' in dish_popularity:
            dish_popularity.pop(dish_popularity.index(''))
        return HttpResponse(dumps({
            'type': dish_types,
            'popularity': dish_popularity
        }, ensure_ascii=False))


class DishIngredientsPreciseData(View):

    def get(self, request, *args, **kwargs):
        requested_dish_id = kwargs['pk']
        related_dish_ingredient_entities = \
            models.DishIngredient.objects.filter(dish=requested_dish_id)
        related_ingredients_values = \
            related_dish_ingredient_entities.values_list(
                'id', 'ingredient',
            )
        ingredients_data = list()
        for related_ingredient_value in related_ingredients_values:
            ingredient_object = models.Ingredient.objects.get(
                id=related_ingredient_value[1]
            )
            standard_portion = models.DishIngredientStandardPortion.objects.get(
                dish_ingredient=related_ingredient_value[0]
            )
            ingredients_data.append({
                'id': ingredient_object.id,
                'name': ingredient_object.name,
                'price': ingredient_object.price,
                'weight_or_volume': standard_portion.weight_or_volume,
                'is_liquid': standard_portion.is_liquid,
                'dish_ingredient': related_ingredient_value[0],
            })
        return HttpResponse(dumps(ingredients_data, ensure_ascii=False))


class AllDishReports(generics.ListAPIView):

    def get(self, request, *args, **kwargs):
        dish_id = kwargs['pk']
        appropriate_dish_reports = \
            list(models.DishReport.objects.filter(dish=dish_id))
        result_report_list = []
        for report in appropriate_dish_reports:
            result_report_list.append({
                'user': report.user.username,
                'text': report.text,
                'publication_date': str(report.publication_date),
            })
        return HttpResponse(dumps(result_report_list, ensure_ascii=False))


class ReportSending(generics.CreateAPIView):

    def post(self, request, *args, **kwargs):
        user_id = request.user.id
        new_report = models.DishReport(
            user=models.User.objects.get(id=user_id),
            dish=models.Dish.objects.get(id=request.data['dish']),
            text=request.data['text'],
            publication_date=date.today(),
        )
        new_report.save()
        return HttpResponse({})


class BackUpMaking(View):

    def post(self, request, *args, **kwargs):
        return perform_os_command('python manage.py dbbackup')


class RestoreDatabase(View):

    def post(self, request, *args, **kwargs):
        return perform_os_command('echo Yes | python manage.py dbrestore')


class UpdateCertificate(View):

    def post(self, request, *args, **kwargs):
        return perform_os_command(
            'mkcert cert key 0.0.0.0 localhost 127.0.0.1 ::1 && mv '
            'cert+5.pem cert.pem && mv cert+5-key.pem key.pem')


def perform_os_command(command):
    try:
        os.system(command)
    except:
        return HttpResponse(status=500)
    return HttpResponse(status=200)


class CartView(generics.RetrieveUpdateDestroyAPIView):
    def post(self, request, *args, **kwargs):
        new_cart_item = create_cart_item(request)
        create_cart_item_ingredients(request, new_cart_item)

        return HttpResponse(dumps({}, ensure_ascii=False))

    def get(self, request, *args, **kwargs):
        user = request.user
        catering_establishment = request.query_params['catering_establishment']
        user_cart = list(models.CartItem.objects.filter(
            user=user, catering_establishment=catering_establishment
        ).values_list(
            'id', 'dish__name', 'price',
            'cartitemingredient__ingredient__name',
            'cartitemingredient__weight_or_volume',
            'cartitemingredient__is_liquid'
        ))
        res = pack_cart_data(user_cart)
        return HttpResponse(dumps(res, ensure_ascii=False))

    def put(self, request, *args, **kwargs):
        user = request.user
        catering_establishment = \
            request.query_params['catering_establishment']
        cart_items = request.query_params.getlist('0')

        user_cart = models.CartItem.objects.filter(
            user=user, catering_establishment=catering_establishment
        ).exclude(id__in=cart_items)
        for item in user_cart:
            item.delete()
        return HttpResponse(dumps({}, ensure_ascii=False))


def create_cart_item(request):
    user = request.user
    request_data = request.data
    price = request_data['price']
    dish = models.Dish.objects.get(id=request_data['dish'])
    catering_establishment = models.CateringEstablishment.objects.get(
        id=request_data['catering_establishment']
    )

    new_cart_item = models.CartItem(
        user=user, dish=dish, price=price,
        catering_establishment=catering_establishment
    )
    new_cart_item.save()

    new_recommendation = models.Recommendations(
        user=user, dish=dish
    )
    new_recommendation.save()

    return new_cart_item


def create_cart_item_ingredients(request, cart_item):
    request_data = request.data
    ingredients = request_data['ingredients']

    for ingredient in ingredients:
        cart_item_ingredient = models.Ingredient.objects.get(
            id=ingredient['ingredient_id']
        )
        weight_or_volume = ingredient['weight_or_volume']
        is_liquid = ingredient['is_liquid']

        new_cart_item_ingredient = models.CartItemIngredient(
            cart_item=cart_item, ingredient=cart_item_ingredient,
            weight_or_volume=weight_or_volume, is_liquid=is_liquid
        )
        new_cart_item_ingredient.save()


def pack_cart_data(user_cart):
    cart_ingredients = defaultdict(list)
    for cart_item in user_cart:
        cart_ingredients[cart_item[0]].append(
            [cart_item[3], cart_item[4], cart_item[5]]
        )

    result = list()
    used_cart_items = []
    for cart_item in user_cart:
        if cart_item[0] not in used_cart_items:
            result.append({
                'id': cart_item[0],
                'name': cart_item[1],
                'price': cart_item[2],
                'ingredients': cart_ingredients[cart_item[0]]
            })
        used_cart_items.append(cart_item[0])
    return result


class UserRecommendations(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        user_recommendations = models.Dish.objects.filter(recommendations__user=user)\
                .annotate(total=Count('recommendations'))\
                .order_by('-total')[:2]\
                .values_list('id', 'name', 'image')
        result = list()
        for k in user_recommendations:
            result.append(list(k))
        print(dumps(result, ensure_ascii=False))
        return HttpResponse(dumps(result, ensure_ascii=False))


class OrderView(generics.RetrieveUpdateDestroyAPIView):

    def post(self, request, *args, **kwargs):
        user = request.user
        request_data = request.data

        cooking_machine = get_appropriate_machine()
        new_order = make_new_order(cooking_machine, user)
        related_dish_dict = get_related_dish_data(new_order)

        empty_user_cart(user, request_data['catering_establishment'])

        data_for_machine = {
            'user': {
                'id': user.id,
                'status': user.is_VIP
            },
            'order': new_order.id,
            'dishes': related_dish_dict
        }

        data_for_sending_to_device = dumps(data_for_machine)

        return HttpResponse(dumps({}, ensure_ascii=False))

    def get(self, request, *args, **kwargs):
        user = request.user
        catering_establishment = request.query_params['catering_establishment']
        user_orders = get_user_orders(user, catering_establishment)
        related_order_data = get_related_order_data(user_orders)
        return HttpResponse(dumps(related_order_data, ensure_ascii=False))

    def delete(self, request, *args, **kwargs):
        order = request.query_params['order']
        order_object = models.Order.objects.get(id=order)
        order_object.delete()
        return HttpResponse(dumps({}, ensure_ascii=False))


def send_data_to_device(data_for_sending_to_device):
    serial_port = serial.Serial(
        'COM5', baudrate=9600, timeout=10
    )
    serial_port.write(data_for_sending_to_device.encode('ascii'))


def make_new_order(cooking_machine, user):
    new_order = models.Order(
        user=user,
        number_in_queue=-1,
        machine=cooking_machine,
        status=0,
        cook_finish_time=datetime(1970, 1, 1)
    )
    new_order.save()

    return new_order


def get_appropriate_machine():
    establishment_machines = models.Order.objects.values('machine')\
            .annotate(total=Count('id'))
    return models.CateringEstablishmentAutomaticMachine.objects.get(id=1)


def get_related_dish_data(order):
    related_dish_data = list(
        models.CartItem.objects.values_list(
            'dish__id', 'cartitemingredient__ingredient_id',
            'cartitemingredient__weight_or_volume'
        )
    )

    related_dish_dict = defaultdict(list)

    for value in related_dish_data:
        dish_id = value[0]
        ingredient = value[1]
        weight_or_volume = value[2]
        related_dish_dict[dish_id].append(
            [ingredient, weight_or_volume]
        )

    result = dict()
    result['count'] = len(related_dish_dict.keys())
    result['data'] = list()
    for key, value in related_dish_dict.items():
        add_order_dish(order, key)
        result['data'].append({
            'id': key,
            'count': len(value),
            'ingredients': value
        })

    return result


def add_order_dish(order, dish_id):
    new_order_dish = models.OrderDish(
        order=order,
        dish=models.Dish.objects.get(id=dish_id)
    )
    new_order_dish.save()


def get_user_orders(user, catering_establishment):
    return list(models.Order.objects.filter(
        user=user,
        machine__catering_establishment__id=catering_establishment
    ).values_list(
        'id', 'status', 'orderdish__dish__name',
        'cook_finish_time', 'number_in_queue'
    ))


def get_related_order_data(user_orders):
    order_dishes = defaultdict(list)
    for order_data in user_orders:
        order_dishes[order_data[0]].append(order_data[2])

    result_dict = dict()
    for order_data in user_orders:
        result_dict[order_data[0]] = [
            order_dishes[order_data[0]],
            order_data[1],
            str(order_data[3]),
            order_data[4]
        ]

    return result_dict


def empty_user_cart(user, catering_establishment):
    user_cart_items = models.CartItem.objects.filter(
        user=user,
        catering_establishment__id=catering_establishment
    )

    for item in user_cart_items:
        item.delete()
