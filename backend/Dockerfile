FROM php:8.3-cli

# Instala dependências do sistema e extensões necessárias do PHP
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath mbstring xml intl

# Copia o executável do Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . /app

ENV COMPOSER_ALLOW_SUPERUSER=1

# Instala as dependências ignorando verificações estritas de plataforma
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --ignore-platform-reqs

EXPOSE 10000

# Inicia o servidor do Laravel na porta exigida pelo Render
CMD php artisan serve --host=0.0.0.0 --port=10000