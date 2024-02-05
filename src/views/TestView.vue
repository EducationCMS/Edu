<script setup lang="ts">
import { computed, ref } from "vue"
import "vue3-circle-progress/dist/circle-progress.css"
import CircleProgress from "vue3-circle-progress"
import RadioButton from "primevue/radiobutton"
import { Countdown } from "@vue-layout/countdown"

const SUBJECTS = [
  'Математика', 'Физика', 'География', 'Биология'
]

const TESTS = [
  {
    subjectName: 'Қазақстан тарихы',
    questions: [
      {
        question: 'Индустрияландыру кезінде Орал-Ембі мұнайлы ауданын зерттеген академик',
        checkedOption: null,
        options: [
          {
            label: 'Қ.И.Сәтбаев.',
            checked: false
          },
          {
            label: 'И.М.Губкин.',
            checked: false
          },
          {
            label: 'Н.С.Курнаков.',
            checked: false
          },
          {
            label: 'А.Панкратова.',
            checked: false
          },
          {
            label: 'А.И.Миронов.',
            checked: false
          }
        ]
      },
      {
        question: 'Түркістан-Сібір темір жол құрылысында еңбек еткен адамдар саны',
        checkedOption: null,
        options: [
          {
            label: '100 мың.',
            checked: false
          },
          {
            label: '150 мың.',
            checked: false
          },
          {
            label: '200 мың.',
            checked: false
          },
          {
            label: '220 мың.',
            checked: false
          },
          {
            label: '300 мың.',
            checked: false
          }
        ]
      },
      {
        question: 'Түркістан-Сібір темір жол құрылысы пайдалануға берілді',
        checkedOption: null,
        options: [
          {
            label: '1928 жылы',
            checked: false
          },
          {
            label: '1929 жылы',
            checked: false
          },
          {
            label: '1930 жылы',
            checked: false
          },
          {
            label: '1931 жылы',
            checked: false
          },
          {
            label: '1932 жылы',
            checked: false
          }
        ]
      }
    ]
  },
  {
    subjectName: 'Математикалық сауаттылық',
    questions: [
      {
        question: 'Жәшікте 12 шар жатыр. Олардың 6-ы қызыл, 3-і ақ, 2-і жасыл және 1-і ақ. Жәшіктен қарамай, кем дегенде екі бірдей түсті шар шығатындай ең аз алынатын шардың санын анықтаңыз',
        checkedOption: null,
        options: [
          {
            label: '5',
            checked: false
          },
          {
            label: '4',
            checked: false
          },
          {
            label: '6',
            checked: false
          },
          {
            label: '7',
            checked: false
          },
          {
            label: '3',
            checked: false
          }
        ]
      },
      {
        question: 'Аңшы оқтарын бес қалтасына, әр қалтада бірден кем емес, бестен артық емес және кез келген екі қалтадағы оқтар саны тең емес болатындай етіп салды. Аңшыда барлығы неше оқ болғанын табыңыз',
        checkedOption: null,
        options: [
          {
            label: '30',
            checked: false
          },
          {
            label: '10',
            checked: false
          },
          {
            label: '12',
            checked: false
          },
          {
            label: '20',
            checked: false
          },
          {
            label: '15',
            checked: false
          }
        ]
      }
    ]
  },
  // {
  //   subjectName: 'Оқу сауаттылығы',
  //   questions: [
  //     {
  //       question: 'Индустрияландыру кезінде Орал-Ембі мұнайлы ауданын зерттеген академик',
  //       checkedOption: null,
  //       options: [
  //         {
  //           label: 'Қ.И.Сәтбаев.',
  //           checked: false
  //         },
  //         {
  //           label: 'И.М.Губкин.',
  //           checked: false
  //         },
  //         {
  //           label: 'Н.С.Курнаков.',
  //           checked: false
  //         },
  //         {
  //           label: 'А.Панкратова.',
  //           checked: false
  //         },
  //         {
  //           label: 'А.И.Миронов.',
  //           checked: false
  //         }
  //       ]
  //     },
  //     {
  //       question: 'Түркістан-Сібір темір жол құрылысында еңбек еткен адамдар саны',
  //       checkedOption: null,
  //       options: [
  //         {
  //           label: '100 мың.',
  //           checked: false
  //         },
  //         {
  //           label: '150 мың.',
  //           checked: false
  //         },
  //         {
  //           label: '200 мың.',
  //           checked: false
  //         },
  //         {
  //           label: '220 мың.',
  //           checked: false
  //         },
  //         {
  //           label: '300 мың.',
  //           checked: false
  //         }
  //       ]
  //     },
  //     {
  //       question: 'Түркістан-Сібір темір жол құрылысы пайдалануға берілді',
  //       checkedOption: null,
  //       options: [
  //         {
  //           label: '1928 жылы',
  //           checked: false
  //         },
  //         {
  //           label: '1929 жылы',
  //           checked: false
  //         },
  //         {
  //           label: '1930 жылы',
  //           checked: false
  //         },
  //         {
  //           label: '1931 жылы',
  //           checked: false
  //         },
  //         {
  //           label: '1932 жылы',
  //           checked: false
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    subjectName: 'Математика',
    questions: [
      {
        question: 'Теңдеуді шеш: 9х – 8•3х -9=0',
        checkedOption: null,
        options: [
          {
            label: '2',
            checked: false
          },
          {
            label: '27',
            checked: false
          },
          {
            label: '4',
            checked: false
          },
          {
            label: '9',
            checked: false
          },
          {
            label: '5',
            checked: false
          }
        ]
      },
      {
        question: 'f(x) =(2х-7)8 функциясының туындысын табыңыз.',
        checkedOption: null,
        options: [
          {
            label: '8(2х- 7)7',
            checked: false
          },
          {
            label: '2х- 7)7',
            checked: false
          },
          {
            label: '8(2х- 7)9',
            checked: false
          },
          {
            label: '(2х- 7)9',
            checked: false
          },
          {
            label: '16 (2х- 7)7',
            checked: false
          }
        ]
      },
    ]
  },
  {
    subjectName: 'Физика',
    questions: [
      {
        question: 'Керілген арқанның үстімен жүріп келе жатқан гимнаст көрермендерді ықыласқа бөледі. Ал егер арқанның үстімен иығына иінағашқа ілінген шелектегі суды алып өтсе тіпті керемет. Арқанның үстінде',
        checkedOption: null,
        options: [
          {
            label: 'тепе-теңдікті сақтау иінағашпен шелектегі суды алып өткенде жеңілірек',
            checked: false
          },
          {
            label: 'тепе-теңдікті сақтау гимнаст тек өзі жүріп өткенде жеңілірек',
            checked: false
          },
          {
            label: 'тепе-теңдікті сақтау мүмкін емес',
            checked: false
          },
          {
            label: 'гимнасттың салмағы артады',
            checked: false
          },
          {
            label: 'гимнасттың салмағы азаяды',
            checked: false
          }
        ]
      },
      {
        question: 'Жабақ пробирканың түбінде маса отыр. Пробирка вертикаль жағдайда еркін құлап келеді. Құлау кезінде маса пробирканың төменгі бөлігінен жоғары бөлігіне ұшып өтсе, пробирканың құлау уақыты',
        checkedOption: null,
        options: [
          {
            label: 'азаяды',
            checked: false
          },
          {
            label: 'артады',
            checked: false
          },
          {
            label: 'өзгермейді',
            checked: false
          },
          {
            label: 'бірінші артады,сосын азаяды',
            checked: false
          },
          {
            label: 'бірінші азаяды, кейін артады',
            checked: false
          }
        ]
      },
      {
        question: 'Құс таразының бір басына орналасқан жәшіктің ішінде отыр. Таразы, екінші басына кір тасы салынып теңгерілген. Егер құс жәшіктің ішінде жоғары көтеріліп ауада қалықтап тұрса, таразының',
        checkedOption: null,
        options: [
          {
            label: 'тепе-теңдігі сақталады',
            checked: false
          },
          {
            label: 'кір тасы жағы басып кетеді',
            checked: false
          },
          {
            label: 'құсы бар жәшік басып кетеді',
            checked: false
          },
          {
            label: 'жалпы салмағы артады',
            checked: false
          },
          {
            label: 'жалпы салмағы кемиді',
            checked: false
          }
        ]
      }
    ]
  }
]

const alphabet = ['A', 'B', 'C', 'D', 'E']
const subjectOne = ref()
const subjectTwo = ref()
const activeSubject = ref(0)
const activeQuestion = ref(0)
const status = ref('not-started')
const tests = ref([...TESTS])

const questions = computed(() => tests.value[activeSubject.value].questions || [])
const question = computed(() => tests.value[activeSubject.value].questions?.[activeQuestion.value] ?? {})

const nextSubject = computed(() => {
  let index = activeSubject.value
  index = index + 1
  return tests.value[index] ? tests.value[index].subjectName : ''
})
const prevSubject = computed(() => {
  let index = activeSubject.value
  index = index - 1
  return tests.value[index] ? tests.value[index].subjectName : ''
})
</script>

<template>
  <div class="flex flex-column h-screen">
    <div v-if="status !== 'started'" class="py-2 px-6 flex align-items-center justify-content-between">
      <img
        src="@/assets/images/logo.png"
        alt="inSight logo"
        class="logo cursor-pointer"
      />
      <div class="flex align-items-center gap-4">
        <div class="flex align-items-center cursor-pointer py-3">
          <Avatar :label="'S'" class="mr-2" size="large" shape="circle" />
          <div>
            <p class="my-0 font-semibold">Syrym Zhumakadyrov</p>
            <p class="my-0 font-medium text-gray-500">000101000000</p>
          </div>
        </div>
      </div>
    </div>
    <template v-if="status === 'not-started'">
      <div class="flex-1 flex flex-column align-items-center">
        <h1>Онлайн тест</h1>
        <div class="mt-4 mb-6 border-circle p-5 bg-green-300 flex align-items-center justify-content-center">
          <img
            src="@/assets/images/ring.png"
            class="cursor-pointer"
            height="160"
          />
        </div>
        <Dropdown
          v-model="subjectOne"
          :options="SUBJECTS"
          input-class="w-20rem"
          placeholder="Бірінші пән"
        />
        <Dropdown
          v-model="subjectTwo"
          :options="SUBJECTS"
          class="mt-3"
          input-class="w-20rem"
          placeholder="Екінші пән"
        />
        <Button
          class="mt-7"
          :disabled="!subjectTwo || !subjectOne"
          label="Тестті бастау"
          @click="status = 'started'"
        />
      </div>
    </template>
    <template v-else-if="status === 'started'">
      <div class="p-8">
        <div class="flex align-items-center justify-content-between">
          <h2 class="mt-0 text-2xl mb-4">{{ tests[activeSubject].subjectName }}</h2>
          <Countdown
            :auto-start="true"
            :interval="1000"
            :time="3600 * 1000 * 4"
          >
            <template #default="props">
            <span class="font-semibold text-xl">
                {{ props.hours }} : {{ props.minutes }} : {{ props.seconds }}
            </span>
            </template>
          </Countdown>
        </div>
        <div class="flex flex-wrap gap-1">
          <div
            v-for="(question, idx) in questions"
            :key="question.question"
            class="test__question_index cursor-pointer"
            :class="{ 'test__question_index--active': activeQuestion === idx }"
            @click="activeQuestion = idx"
          >
            {{ idx + 1 }}
          </div>
        </div>
        <div class="mt-5">
          <p class="text-xl mb-5">{{ activeQuestion + 1 }}. {{ question.question }}:</p>
          <div class="flex flex-column gap-3">
            <div v-for="(option, oIdx) in question.options" :key="option.id" class="flex align-items-center">
              <RadioButton v-model="question.checkedOption" :inputId="`option_${option.label}`" name="category" :value="option.label"/>
              <label :for="`option_${option.label}`" class="ml-2">{{ alphabet[oIdx] }}) {{ option.label }}</label>
            </div>
          </div>
        </div>
        <div class="flex align-items-center gap-3 mt-7">
          <Button
            icon="pi pi-chevron-left"
            class="bg-green-100 text-green-500"
            text
            :disabled="activeQuestion === 0"
            @click="activeQuestion--"
          />
          <Button
            icon="pi pi-chevron-right"
            class="bg-green-100 text-green-500"
            text
            :disabled="activeQuestion === questions.length-1"
            @click="activeQuestion++"
          />
        </div>
        <div class="mt-6 flex">
          <Button
            :label="prevSubject"
            icon="pi pi-chevron-left"
            :disabled="!prevSubject"
            @click="activeSubject--; activeQuestion = 0"
          />
          <Button
            :label="nextSubject"
            :disabled="!nextSubject"
            icon-pos="right"
            icon="pi pi-chevron-right"
            class="ml-3"
            @click="activeSubject++; activeQuestion = 0"
          />
          <Button
            severity="danger"
            label="Аяқтау"
            class="ml-auto"
            @click="status = 'finished'"
          />
        </div>
      </div>
    </template>
    <template v-else-if="status === 'finished'">
      <div class="flex flex-column align-items-center">
        <h1 class="mb-6">Тест нәтижесі</h1>
        <CircleProgress
          size="150"
          :percent="70"
          show-percent
          border-bg-width="20"
          border-width="20"
          fill-color="#52CD9F"
        >70%</CircleProgress>
        <div class="flex flex-column mt-5">
          <div class="flex align-items-center justify-content-between w-30rem text-xl border-bottom-1 border-300 py-4">
            <span>Қазақстан тарихы</span>
            <span>10</span>
          </div>
          <div class="flex align-items-center justify-content-between w-30rem text-xl border-bottom-1 border-300 py-4">
            <span>Математикалық сауаттылық</span>
            <span>10</span>
          </div>
          <div class="flex align-items-center justify-content-between w-30rem text-xl border-bottom-1 border-300 py-4">
            <span>Оқу сауаттылығы</span>
            <span>10</span>
          </div>
          <div class="flex align-items-center justify-content-between w-30rem text-xl border-bottom-1 border-300 py-4">
            <span>{{ subjectOne ?? 'Математика' }}</span>
            <span>10</span>
          </div>
          <div class="flex align-items-center justify-content-between w-30rem text-xl border-bottom-1 border-300 py-4">
            <span>{{ subjectTwo ?? 'Физика' }}</span>
            <span>10</span>
          </div>
        </div>
        <Button
          label="Аяқтау"
          class="mt-5"
          size="large"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.current-counter {
  font-size: 2.5rem;
  font-weight: 600;
}

.test__question {
  &_index {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    font-weight: 500;
    opacity: 0.4;
    color: #FFF;
    border-radius: 100%;
    background-color: var(--primary-500);

    &--active {
      opacity: 1;
    }

    &--disabled {
      background-color: #C3C1C1;
    }
  }
}
</style>
