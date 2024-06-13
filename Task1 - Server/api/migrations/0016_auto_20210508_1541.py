# Generated by Django 3.1.3 on 2021-05-08 15:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_auto_20210508_1539'),
    ]

    operations = [
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.FloatField()),
                ('catering_establishment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cateringestablishment')),
                ('dish', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dish')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CartItemIngredient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weight_or_volume', models.FloatField()),
                ('cart_item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cartitem')),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ingredient')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number_in_queue', models.IntegerField(null=True)),
                ('status', models.IntegerField()),
                ('cook_finish_time', models.DateTimeField(null=True)),
                ('machine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.cateringestablishmentautomaticmachine')),
            ],
        ),
        migrations.DeleteModel(
            name='OrderedDishIngredient',
        ),
    ]