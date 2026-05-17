from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vocabulary', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabularyword',
            name='meaning',
            field=models.TextField(blank=True),
        ),
    ]
