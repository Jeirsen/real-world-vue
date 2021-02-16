import Vue from 'vue'
import VueRouter from 'vue-router'
import EventCreate from '../views/EventCreate.vue'
import EventList from '../views/EventList.vue'
import EventShow from '../views/EventShow.vue'
import NotFound from '../views/NotFound.vue'
import NetWorkIssue from '../views/NetWorkIssue.vue'
import Example from '../views/Example.vue'

import Nprogress from 'nprogress'
import store from '@/store/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'event-list',
    component: EventList,
    props: true
  },
  {
    path: '/example',
    component: Example
  },
  {
    path: '/event/:id',
    name: 'event-show',
    component: EventShow,
    props: true,
    beforeEnter: (to, from, next) => {
      store
        .dispatch('event/fetchEvent', to.params.id)
        .then(event => {
          to.params.event = event
          next()
        })
        .catch(error => {
          if (error.response && error.response.status == 404) {
            next({ name: '404', params: { resource: 'event' } })
          } else {
            next({ name: 'network-issue' })
          }
        })
    }
  },
  {
    path: '/event/create',
    name: 'event-create',
    component: EventCreate
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
    props: true
  },
  {
    path: '/network-issue',
    name: 'network-issue',
    component: NetWorkIssue
  },
  {
    path: '*',
    redirect: { name: '404', params: { resource: 'page' } }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((routeTo, routeFrom, next) => {
  Nprogress.start()
  next()
})

router.afterEach(() => {
  Nprogress.done()
})

export default router
