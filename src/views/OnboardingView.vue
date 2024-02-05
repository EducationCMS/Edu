<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<template>
  <header>
    <div class="flex justify-content-between align-items-center">
      <img src="@/assets/images/logo.png" alt="inSight logo" class="logo" />
      <div class="navbar__menu">
        <ul class="list-none font-semibold flex align-items-center gap-4">
          <li>Все курсы</li>
          <li>Учителя</li>
          <li>Главная</li>
          <li>
            <Button label="Войти" @click="router.push({ name: 'Login' })" />
          </li>
        </ul>
      </div>
    </div>
  </header>
  <main>
    <section class="container py-8">
      <h4 class="text-primary">Онлайн школа</h4>
      <h1 class="text-6xl my-4">
        Онлайн школа in<span class="text-primary">Sight</span>
      </h1>
      <h2 class="text-xl text-gray-500 font-light line-height-3 mb-5">
        Поможем подготовиться в удобном<br />
        формате и сдать экзамены без стресса
      </h2>
      <div>
        <Button label="Записаться" class="border-round mr-3 px-6 py-3" @click="router.push({ name: 'JoinLesson' })" />
        <Button label="Подробнее" class="p-button-outlined px-6 py-3" />
      </div>
    </section>
    <section class="container">
      <h2>Подберите занятия для своей цели</h2>
      <div class="grid gap-5">
        <div class="col card">
          <img
            src="@/assets/images/landing/books.png"
            alt="books"
            class="card__img"
          />
          <h2>ЕНТ</h2>
          <div class="card__divider" />
          <p class="text-sm line-height-3">
            Полная подготовка по всем предметам для сдачи ЕНТ
          </p>
        </div>
        <div class="col card">
          <img
            src="@/assets/images/landing/magister.png"
            alt="books"
            class="card__img"
          />
          <h2>Магистратура</h2>
          <div class="card__divider" />
          <p class="text-sm line-height-3">
            Подготовка к экзаменам для поступления в магистратуру в Казахстане
          </p>
        </div>
        <div class="col card">
          <img
            src="@/assets/images/landing/case.png"
            alt="books"
            class="card__img"
          />
          <h2>Учителя</h2>
          <div class="card__divider" />
          <p class="text-sm line-height-3">
            Поможем повысить квалификацию и сдать квал тест
          </p>
        </div>
      </div>
    </section>
    <section class="container">
      <h1 class="text-center text-6xl">
        <span class="text-primary">InSight</span> - это
      </h1>
      <div class="grid my-6">
        <div class="col flex flex-column justify-content-around text-2xl">
          <p>Занятия в формате онлайн-трансляций и теоретических уроков</p>
          <p>Подготовка по всем предметам</p>
          <p>Профессиональные учителя</p>
        </div>
        <div class="col-3">
          <Button
            class="p-button-outlined p-button-lg w-full border-3 justify-content-center mb-4 font-semibold"
          >
            Формат
          </Button>
          <Button
            class="p-button-outlined p-button-lg w-full border-3 justify-content-center mb-4 font-semibold"
          >
            Платформа
          </Button>
          <Button
            class="p-button-outlined p-button-lg w-full border-3 justify-content-center mb-4 font-semibold"
          >
            Методы
          </Button>
          <Button
            class="p-button-outlined p-button-lg w-full border-3 justify-content-center font-semibold"
          >
            Поддержка
          </Button>
        </div>
      </div>
    </section>
    <section class="container my-6">
      <div class="grid">
        <div class="col pt-6">
          <h2 class="text-3xl font-semibold">
            Попробуйте бесплатно и примите решение
          </h2>
          <p class="text-xl line-height-3">
            Поучаствуйте на первом пробном уроке и посмотрите как проходят наши
            уроки
          </p>
        </div>
        <div class="col">
          <form action="" class="try-form">
            <InputText
              class="border-none p-inputtext-lg w-full mb-5"
              placeholder="Имя"
              type="text"
            />
            <InputText
              class="border-none p-inputtext-lg w-full mb-5"
              placeholder="Телефон"
              type="text"
            />
            <div class="text-center">
              <Button
                label="Начать учиться бесплатно"
                class="p-button-warning p-button-lg"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
    <section class="container my-6">
      <h2 class="mb-6">Узнай свой шанс на грант</h2>
      <div class="grid">
        <div class="col">
          <CascadeSelect
            placeholder="Первый предмет"
            class="mb-4 w-full"
          />
          <CascadeSelect placeholder="Второй предмет" class="mb-4 w-full" />
          <div class="field-radiobutton">
            <RadioButton name="type" value="1" aria-label="Сельская квота" />
            <label for="city2">Сельская квота</label>
          </div>
          <div class="mb-4">
            <p>Твои баллы по ЕНТ <b style="float: right">80</b></p>
            <Slider />
          </div>
          <Button label="Анализ" class="w-full" />
        </div>
        <div class="col flex justify-content-center align-items-center">
          <img
            src="@/assets/images/landing/cup.png"
            class="calculate-score__img"
            alt="cup"
          />
        </div>
      </div>
    </section>
    <section class="px-8 my-8">
      <h1 class="text-center text-5xl">
        Почему <span class="text-primary">InSight</span>?
      </h1>
      <div class="grid justify-content-center my-8">
        <div class="col-5">
          <div class="why-insight__image why-insight__image-1">
            <img src="@/assets/images/landing/globe.png" alt="globe"/>
          </div>
        </div>
        <div class="col-5 pt-8">
          <p class="text-4xl font-semibold">Занятия идут в прямом эфире</p>
          <p class="font-light line-height-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo
          </p>
        </div>
      </div>
      <div class="grid justify-content-between my-8">
        <div class="col-5 col-offset-1 pt-8">
          <p class="text-4xl font-semibold">Вручную проверяем задания и домашние работы</p>
          <p class="font-light line-height-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo
          </p>
        </div>
        <div class="col-5">
          <div class="why-insight__image why-insight__image-2">
            <img src="@/assets/images/landing/globe.png" alt="globe"/>
          </div>
        </div>
      </div>
      <div class="grid justify-content-center my-8">
        <div class="col-5">
          <div class="why-insight__image why-insight__image-3">
            <img src="@/assets/images/landing/globe.png" alt="globe"/>
          </div>
        </div>
        <div class="col-5 pt-8">
          <p class="text-4xl font-semibold">Куратор ответит вам в течении двух часов</p>
          <p class="font-light line-height-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo
          </p>
        </div>
      </div>
    </section>
    <section class="bg-yellow-300 p-8">
      <div class="grid justify-content-around">
        <div class="col-4">
          <form action="" class="try-form">
            <InputText
              class="border-none p-inputtext-lg w-full mb-5"
              placeholder="Имя"
              type="text"
            />
            <InputText
              class="border-none p-inputtext-lg w-full mb-5"
              placeholder="Телефон"
              type="text"
            />
            <div class="text-center">
              <Button
                label="Начать учиться бесплатно"
                class="p-button-warning p-button-lg"
              />
            </div>
          </form>
        </div>
        <div class="col-5">
          <h3 class="text-4xl mb-6">Остались вопросы?</h3>
          <ul class="list-none text-xl font-normal">
            <li class="flex align-items-center mb-5">
              <div class="dot is-dotted" />
              Оставьте заявку
            </li>
            <li class="flex align-items-center mb-5">
              <div class="dot is-dotted" />
              Дождитесь нашего звонка
            </li>
            <li class="flex mb-5">
              <div class="dot" />
              Задайте вопросы, а мы на них ответим и поможем подобрать занятия
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
  <footer class="p-6">
    <div class="grid justify-content-evenly text-white">
      <div class="col-3">
        <p class="text-2xl font-bold ml-5">Социальные сети</p>
        <ul class="list-none">
          <li>Instagram</li>
          <li>Facebook</li>
          <li>TikTok</li>
          <li>YouTube</li>
        </ul>
      </div>
      <div class="col-3">
        <p class="text-2xl font-bold">Наш адрес</p>
        <p>г. Алматы, ул. Муканова 92</p>
      </div>
      <div class="col-3">
        <p class="text-2xl font-bold">Контакты</p>
        <p><a href="phone:+77071332233">+7 707 111 22 33</a></p>
        <p><a href="phone:+77071332233">+7 707 111 22 44</a></p>
        <p>in_sight@gmail.com</p>
      </div>
      <div class="col-3">
        <p class="text-2xl font-bold">Пишите нам</p>
        <p>+7 707 259 5500</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.test {
  color: red;
}
.card {
  background: #ffffff;
  box-shadow: 0 13px 19px rgba(0, 0, 0, 0.07);
  padding: 35px 40px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__img {
    width: 180px;
    height: 180px;
  }
  &__divider {
    width: 50px;
    height: 2px;
    background-color: #ffb400;
  }
  p {
    color: #737373;
  }
}
.try-form {
  background-color: #ececec;
  border-radius: 20px;
  padding: 100px 60px;
  border: 1px solid #f1f1f1;
  box-shadow: 20px 4px 30px rgba(80, 55, 236, 0.25);
}
.calculate-score__img {
  width: 200px;
  height: 200px;
}
.why-insight {
  &__image {
    height: 400px;
    width: 440px;
    display: flex;

    img {
      height: 100%;
      width: auto;
      margin: auto;
    }

    &-1 {
      background-color: #ee8d98;
      border-radius: 10px;
      box-shadow: 3rem 3rem 0 0 #566df6;
    }
    &-2 {
      background-color: #85daed;
      border-radius: 10px;
      box-shadow: -3rem 3rem 0 0 #ffb400;
    }
    &-3 {
      background-color: #c6de83;
      border-radius: 10px;
      box-shadow: 3rem 3rem 0 0 #f48686;
    }
  }
}
.dot {
  height: 1.5rem;
  width: 1.5rem;
  background-color: #374957;
  border-radius: 100%;
  margin-right: 2rem;
  flex: 0 0 1.5rem;
  position: relative;

  &.is-dotted {
    &:before {
      position: absolute;
      content: "...";
      top: calc(100% + 4px);
      left: 10px;
      transform: rotate(90deg);
    }
  }
}
</style>

