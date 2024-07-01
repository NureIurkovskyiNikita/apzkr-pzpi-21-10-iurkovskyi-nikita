import api.models as models
from rest_framework.serializers import ModelSerializer, Serializer, BaseSerializer


class CateringEstablishmentSerializer(ModelSerializer):
    class Meta:
        model = models.CateringEstablishment
        fields = '__all__'


class DishSerializer(ModelSerializer):
    class Meta:
        model = models.Dish
        fields = '__all__'


class IngredientSerializer(ModelSerializer):
    class Meta:
        model = models.Ingredient
        fields = '__all__'


class DishIngredientSerializer(ModelSerializer):
    class Meta:
        model = models.DishIngredient
        fields = '__all__'


class AppropriateDishesSerializer(Serializer):
    def to_representation(self, instance):
        res = []
        for k in instance:
            res.append({
                'name': k.name,
                'image': str(k.image) if k.image else None,
                'type': k.type
            })
        return res


class AutomaticMachineTypeSerializer(ModelSerializer):
    class Meta:
        model = models.AutomaticMachineType
        fields = '__all__'


class CateringEstablishmentAutomaticMachineSerializer(ModelSerializer):
    class Meta:
        model = models.CateringEstablishmentAutomaticMachine
        fields = '__all__'


class AutomaticMachineDishSerializer(ModelSerializer):
    class Meta:
        model = models.AutomaticMachineDish
        fields = '__all__'


class UserSerializer(ModelSerializer):
    class Meta:
        model = models.User
        fields = ['username', 'password', 'is_VIP']


class DishReportSerializer(ModelSerializer):
    class Meta:
        model = models.DishReport
        fields = '__all__'


# class OrderedDishIngredientSerializer(ModelSerializer):
#     class Meta:
#         model = models.OrderedDishIngredient
#         fields = '__all__'


# class CartItemSerializer(ModelSerializer):
#     class Meta:
#         model = models.CartItem
#         fields = '__all__'
#
#
# class CartItemIngredientSerializer(ModelSerializer):
#     class Meta:
#         model = models.CartItemIngredient
#         fields = '__all__'
#
#
# class OrderSerializer(ModelSerializer):
#     class Meta:
#         model = models.Order
#         fields = '__all__'
