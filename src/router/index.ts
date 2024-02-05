import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/LoginView.vue")
    },
    {
      path: "/test",
      name: "Test",
      component: () => import("../views/TestView.vue")
    },
    {
      path: "/lesson/join",
      name: "JoinLesson",
      component: () => import("../views/lesson/JoinLessonView.vue")
    },
    {
      path: "/lesson/kurento",
      name: "KurentoTest",
      component: () => import("../views/lesson/KurentoTest.vue")
    },
    // {
    //   path: "/login",
    //   name: "Login",
    //   component: () => import("../views/LoginView.vue")
    // },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("../views/ProfileView.vue"),
      meta: {
        sidebar: true
      }
    },
    {
      path: "/progress",
      name: "Progress",
      component: () => import("../views/Student/ProgressView.vue"),
      meta: {
        sidebar: true
      }
    },
    {
      path: "/courses",
      name: "CourseList",
      component: () => import("../views/Student/Course/CourseListVIew.vue"),
      meta: {
        sidebar: true
      }
    },
    {
      path: "/courses/:id",
      name: "CourseDetail",
      component: () => import("../views/Student/Course/CourseDetailView.vue"),
      props: true,
      meta: {
        sidebar: true
      }
    },
    {
      path: "/posts",
      name: "PostList",
      component: () => import("../views/Student/Post/PostListView.vue"),
      meta: {
        sidebar: true
      }
    },
    {
      path: "/posts/:id",
      name: "PostDetail",
      component: () => import("../views/Student/Post/PostDetailView.vue"),
      props: true,
      meta: {
        sidebar: true
      }
    },
    {
      path: "/universities",
      name: "UniversityList",
      component: () => import("../views/Student/University/UniversityListView.vue"),
      meta: {
        sidebar: true
      }
    },
    {
      path: "/universities/:id",
      name: "UniversityDetail",
      component: () => import("../views/Student/University/UniversityDetailView.vue"),
      props: true,
      meta: {
        sidebar: true
      }
    },
    {
      path: "/specializations/:id",
      name: "SpecializationDetail",
      component: () => import("../views/Student/University/SpecializationDetailView.vue"),
      props: true,
      meta: {
        sidebar: true
      }
    },
    {
      path: "/question",
      name: "QuestionAnswer",
      component: () => import("../views/Student/QuestionAnswerView.vue"),
      meta: {
        sidebar: true
      }
    },
    {
      path: "/admin",
      name: "Admin",
      redirect: '/admin/analytics',
      children: [
        {
          path: 'analytics',
          name: 'AdminAnalytics',
          component: () => import("../views/Admin/AnalyticsView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'managers',
          name: 'AdminManagerList',
          component: () => import("../views/Admin/Manager/ManagerListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'managers/:id',
          name: 'AdminManagerDetail',
          component: () => import("../views/Admin/Manager/ManagerDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'teachers',
          name: 'AdminTeacherList',
          component: () => import("../views/Admin/Teacher/TeacherListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'teachers/:id',
          name: 'AdminTeacherDetail',
          component: () => import("../views/Admin/Teacher/TeacherDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'students',
          name: 'AdminStudentList',
          component: () => import("../views/Admin/Student/StudentListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'students/:id',
          name: 'AdminStudentDetail',
          component: () => import("../views/Admin/Student/StudentDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'groups',
          name: 'AdminGroupList',
          component: () => import("../views/Admin/Group/GroupListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'groups/:id',
          name: 'AdminGroupDetail',
          props: true,
          component: () => import("../views/Admin/Group/GroupDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'courses',
          name: 'AdminCourseList',
          component: () => import("../views/Admin/Course/CourseListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'courses/:id',
          name: 'AdminCourseDetail',
          props: true,
          component: () => import("../views/Admin/Course/CourseDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'online-tests',
          name: 'AdminOnlineTestList',
          component: () => import("../views/Admin/OnlineTest/OnlineTestListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'online-tests/:id',
          name: 'AdminOnlineTestDetail',
          component: () => import("../views/Admin/OnlineTest/OnlineTestDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'tests',
          name: 'AdminTestList',
          component: () => import("../views/Admin/Test/TestList.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'posts',
          name: 'AdminPostList',
          component: () => import("../views/Admin/Post/PostListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'posts/create',
          name: 'AdminPostCreate',
          component: () => import("../views/Admin/Post/PostCreateView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'posts/:id/edit',
          name: 'AdminPostEdit',
          component: () => import("../views/Admin/Post/PostEditView.vue"),
          props: true,
          meta: {
            sidebar: true
          }
        },
        {
          path: 'specializations',
          name: 'AdminSpecializationList',
          component: () => import("../views/Admin/University/SpecializationListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'universities',
          name: 'AdminUniversityList',
          component: () => import("../views/Admin/University/UniversityListView.vue"),
          meta: {
            sidebar: true
          }
        },
      ]
    },
    {
      path: "/manager",
      name: "Manager",
      redirect: '/manager/create-student',
      children: [
        {
          path: 'create-student',
          name: 'ManagerCreateStudent',
          component: () => import("../views/Manager/CreateStudentView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'students',
          name: 'ManagerStudentList',
          component: () => import("../views/Manager/StudentListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'my-students',
          name: 'ManagerMyStudentList',
          component: () => import("../views/Manager/MyStudentListView.vue"),
          meta: {
            sidebar: true
          }
        }
      ]
    },
    {
      path: "/teacher",
      name: "Teacher",
      children: [
        {
          path: '',
          name: 'TeacherMain',
          component: () => import("../views/Teacher/TeacherView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'groups',
          name: 'TeacherGroupList',
          component: () => import("../views/Teacher/Group/GroupListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'groups/:id',
          name: 'TeacherGroupDetail',
          props: true,
          component: () => import("../views/Teacher/Group/GroupDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'groups/:group_id/course/:course_id',
          name: 'TeacherGroupCourseDetail',
          props: true,
          component: () => import("../views/Teacher/Course/CourseDetail.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'groups/:group_id/course/:course_id/task/:task_id',
          name: 'TeacherGroupCourseTaskDetail',
          props: true,
          component: () => import("../views/Teacher/Group/GroupDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'tasks',
          name: 'TeacherTask',
          component: () => import("../views/Teacher/Task/TaskView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'tasks/:group_id/',
          name: 'TeacherTaskList',
          component: () => import("../views/Teacher/Task/TaskListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'tasks/:group_id/:task_id',
          name: 'TeacherTaskDetail',
          component: () => import("../views/Teacher/Task/TaskDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'grades',
          name: 'TeacherGrade',
          component: () => import("../views/Teacher/Grade/GradeView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'grades/:group_id/',
          name: 'TeacherGradeList',
          component: () => import("../views/Teacher/Grade/GradeListView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'grades/:group_id/:task_id',
          name: 'TeacherGradeDetail',
          component: () => import("../views/Teacher/Grade/GradeDetailView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'analytics',
          name: 'TeacherAnalytics',
          component: () => import("../views/Teacher/Analytics/AnalyticsView.vue"),
          meta: {
            sidebar: true
          }
        },
        {
          path: 'analytics/:group_id',
          name: 'TeacherAnalyticsList',
          component: () => import("../views/Teacher/Analytics/AnalyticsGroupView.vue"),
          meta: {
            sidebar: true
          }
        },
      ]
    },
  ]
})

export default router
