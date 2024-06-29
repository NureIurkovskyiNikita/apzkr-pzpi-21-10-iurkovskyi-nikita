from django.db import models
from django.contrib.auth.models import AbstractUser, Permission
from django.utils.translation import gettext_lazy as _

#являє сутність закладу громадського харчування
class CateringEstablishment(models.Model):
    name = models.CharField(max_length=20)
    establishment_code = models.UUIDField()
    image = models.ImageField(
        blank=True,
        upload_to='cateringEstablishmentImages/'
    )
    country = models.CharField(max_length=25)
    city = models.CharField(max_length=25)
    street = models.CharField(max_length=30)

    def __str__(self):
        return self.name

#Описує страву з полями, такими як назва, зображення, опис, тип, популярність та рейтинг
class Dish(models.Model):
    name = models.CharField(max_length=20)
    image = models.ImageField(
        blank=True, upload_to='dishImages/'
    )
    description = models.TextField()
    type = models.CharField(max_length=20)
    popularity = models.CharField(
        max_length=20, blank=True
    )
    rate = models.IntegerField()

    def __str__(self):
        return self.name

#Надає інгредієнт з полями для назви та ціни
class Ingredient(models.Model):
    name = models.CharField(max_length=20)
    price = models.FloatField()

    def __str__(self):
        return self.name

#Зв'язує блюдо з його інгредієнтами.
class DishIngredient(models.Model):
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.CASCADE
    )
    dish = models.ForeignKey(
        Dish, on_delete=models.CASCADE
    )
    # status = models.BooleanField()

    def __str__(self):
        return f'{self.dish.name}: {self.ingredient.name}'

#Задає стандартну порцію інгредієнта для блюда.
class DishIngredientStandardPortion(models.Model):
    dish_ingredient = models.ForeignKey(
        DishIngredient, on_delete=models.CASCADE
    )
    weight_or_volume = models.FloatField()
    is_liquid = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.dish_ingredient.dish} - {self.dish_ingredient.ingredient}'

#Надає тип автомата
class AutomaticMachineType(models.Model):

    def __str__(self):
        return str(self.id)

#Зв'язує заклад комунального харчування з типом автомата
class CateringEstablishmentAutomaticMachine(models.Model):
    catering_establishment = models.ForeignKey(
        CateringEstablishment,
        on_delete=models.CASCADE
    )
    automatic_machine_type = models.ForeignKey(
        AutomaticMachineType,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.catering_establishment.id}: ' \
               f'{self.automatic_machine_type.id}'

#Зв'язує тип автомата зі стравою
class AutomaticMachineDish(models.Model):
    automatic_machine_type = models.ForeignKey(
        AutomaticMachineType,
        on_delete=models.CASCADE
    )
    dish = models.ForeignKey(
        Dish, on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.automatic_machine_type.id}: ' \
               f'{self.dish.name}'

#Звіт про блюдо, пов'язаний з користувачем та блюдом
class User(AbstractUser):
    is_VIP = models.BooleanField(null=True)
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='users',
        related_query_name='user',
    )

    def __str__(self):
        return self.username


class DishReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    text = models.TextField()
    publication_date = models.DateField()


# class OrderedDishIngredient(models.Model):
#     ingredient = models.ForeignKey(DishIngredient, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     weight_or_volume = models.FloatField()
#     order_date = models.DateField()
#     order_time = models.TimeField()


class CartItem(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE
    )
    dish = models.ForeignKey(
        Dish, on_delete=models.CASCADE
    )
    catering_establishment = models.ForeignKey(
        CateringEstablishment, on_delete=models.CASCADE
    )
    price = models.FloatField()

    def __str__(self):
        return f'{self.id}: user={self.user.username} ' \
               f'dish={self.dish.name} price={self.price}' \
               f'catering_establishment={self.catering_establishment.name}'


class CartItemIngredient(models.Model):
    cart_item = models.ForeignKey(
        CartItem, on_delete=models.CASCADE
    )
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.CASCADE
    )
    weight_or_volume = models.FloatField()
    is_liquid = models.BooleanField()

    def __str__(self):
        return f'{self.id}: cart_item={self.cart_item.id} ' \
               f'ingredient={self.ingredient.name} ' \
               f'weight_or_volume={self.weight_or_volume}'

#Представляє замовлення з інформацією про користувача
class Order(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE
    )
    number_in_queue = models.IntegerField(null=True)
    machine = models.ForeignKey(
        CateringEstablishmentAutomaticMachine,
        on_delete=models.CASCADE
    )
    status = models.IntegerField()
    cook_finish_time = models.DateTimeField(null=True)

    def __str__(self):
        return f'{self.id}: number_in_queue={self.number_in_queue} ' \
               f'machine={self.machine.id}'

#Зв'язує замовлення зі стравами
class OrderDish(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.id}: {self.order.id} {self.dish.name}'

#Зв'язує користувача з рекомендованими стравами.
class Recommendations(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE
    )
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user}: {self.dish}'
