<template>
  <v-app dark>
    <v-app-bar
      color="blue darken-4"
      v-if="isLogin"
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <div class="pl-1" v-for="(link, i) in links" :key="i">
        <v-btn
          v-if="!link.subLinks"
          elevation="0"
          class="ml-n4"
          :style="{
            backgroundColor: link.active ? 'white !important' : 'transparent',
            color: link.active ? '#0d47a1 !important' : 'white',
          }"
          @click="gotoContact(link.to)"
        >
          {{ link.text }}
        </v-btn>
        <v-btn
          v-else
          elevation="0"
          class="ml-n4"
          :style="{
            backgroundColor: link.active ? 'white !important' : 'transparent',
            color: link.active ? '#0d47a1 !important' : 'white',
          }"
          @click="openDrawer(link)"
        >
          {{ link.text }}
        </v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-layout class="pa-4">
        <nuxt />
      </v-layout>
    </v-main>
  </v-app>
</template>

<script>
import gql from 'graphql-tag'
import firebase from 'firebase'
export default {
  layout: 'Default',
  asyncData({ route, params }) {
    console.log('tempssss')
  },
  data() {
    return {
      changeBackgroundColor: false,
      items: [],
      dialogSignOut: false,
      isLogin: false,
      closeMenu: true,
      openSubGroup: false,
      clipped: false,
      drawer: false,
      fixed: false,
      user: [],
      test: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
      links: [
        {
          icon: 'mdi-chart-bubble',
          text: 'Quản lý khám bệnh',
          active: false,
          // to: '/list/old_core/patients',
          subLinks: [
            {
              icon: 'mdi-chart-bubble',
              text: 'Danh sách bệnh nhân',
              to: '/list/old_core/patient/patients',
            },
            {
              icon: 'mdi-chart-bubble',
              text: 'Danh sách bác sĩ',
              to: '/list/old_core/employee/doctors',
            },
            {
              icon: 'mdi-chart-bubble',
              text: 'Danh sách phòng ban',
              to: '/list/old_core/department/departments',
            },
            {
              icon: 'mdi-chart-bubble',
              text: 'Danh sách đơn vị bệnh viện',
              to: '/list/old_core/hospital_unit/hospital_units',
            },
            {
              icon: 'mdi-chart-bubble',
              text: 'Danh sách phòng khám',
              to: '/list/old_core/clinic/clinics',
            },
          ],
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '',
    }
  },

  computed: {},
  watch: {
    openSubGroup(val) {
      this.closeMenu = false
    },
  },

  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('?sss?????', user)
          this.user.id = user.uid
          this.user.email = user.email
          // update data or vuex state
          this.isLogin = true
          const querySearch = gql`
        query MyQuery {
          users(
            where: { id: { _eq: "${this.user.id}" } }
          ) {
            id
            employee{
              id
              fullname
            }
          }
        }
      `

          this.$apollo
            .query({
              query: querySearch,
              fetchPolicy: 'network-only',
            })
            .then((response) => {
              if (response.data.users.length > 0) {
                this.user.employee = response.data.users[0].employee
                if (this.user.employee === null) {
                  this.user.employee = {
                    id: null,
                    fullname: null,
                  }
                }
                // LƯu data
                this.$store.commit('data/setData', this.user)

                // Lấy data
                // const temp = this.$store.state.data.editUserData
              }
            })
            .catch((response) => console.log(response))
        } else {
          console.log('??????')
          this.$router.replace({
            name: 'login',
            path: '',
          })
        }
      })
    },
    gotoContact(link) {
      const route = this.$router.resolve({ path: link })
      window.open(route.href)
    },
    openDialogSignout() {
      this.closeMenu = true
      this.dialogSignOut = true
    },
    openDrawer(link) {
      for (let index = 0; index < this.links.length; index++) {
        const element = this.links[index]
        element.active = false
      }
      link.active = true
      if (link.subLinks) {
        this.items = link.subLinks
        // this.drawer = true
      }
    },

    signOut() {
      console.log('signout')
      this.isLogin = false
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: 'login',
            path: '',
          })
        })
    },
    toLink(link) {
      this.$router.push({
        path: `/${link}`,
      })
    },
    changePassword() {
      this.closeMenu = true
      this.$router.push({
        path: `/list/old_core/user/user_change_password`,
        query: { id: `${this.user.id}` },
      })
    },
  },
}
</script>
<style scoped>
.v-text-field {
  width: 10px;
}
.theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0.12) !important;
}
.white_list .v-list-item-group .v-list-item {
  color: white;
}
.white_list .v-list-item-group .v-list-item--active {
  background-color: white;
  color: #0d47a1;
}

.buttonActive {
  background: white !important;
  color: #0d47a1;
}
.buttonNormal {
  background: transparent !important;
  color: white;
}
</style>
