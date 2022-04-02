<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="isLogin"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      class="mx-auto"
      color="blue darken-4"
      permanent
      fixed
      app
      disable-route-watcher
      disable-resize-watcher
      width="280"
    >
      <img
        src="../static/logo-taimuihongsg.jpg"
        alt="Logo"
        height="120"
        class="logo justify-center pa-1"
        width="100%"
      />
      <!-- </v-row> -->
      <v-row justify="space-around" class="pt-3 pb-3"
        ><v-btn
          class="ml-2"
          dark
          min-width="0"
          text
          @click="toLink('dashboard')"
        >
          <v-icon>mdi-home-circle</v-icon>
        </v-btn>
        <v-menu
          bottom
          left
          offset-y
          origin="top right"
          transition="scale-transition"
        >
          <template #activator="{ attrs, on }">
            <v-btn dark min-width="0" text v-bind="attrs" v-on="on">
              <v-badge color="red" overlap>
                <template #badge>
                  <span>5</span>
                </template>

                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
        </v-menu>

        <v-menu :close-on-content-click="closeMenu" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn min-width="0" dark text v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item color="primary" @click="changePassword()">
              <v-list-item-title> Thông tin tài khoản</v-list-item-title>
            </v-list-item>
            <v-list-item color="primary" @click="dialogSignOut = true">
              <v-list-item-title> Đăng xuất</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu></v-row
      >
      <v-list nav dense class="white_list">
        <v-list-item-group v-for="(item, i) in items" :key="i">
          <v-list-item :to="item.to" class="v-list-item">
            <v-list-item-icon>
              <v-icon dark>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-title v-text="item.text" />
          </v-list-item>
          <v-divider class="white"></v-divider>
        </v-list-item-group>
        <!-- </div> -->
      </v-list>
    </v-navigation-drawer>
    <v-dialog v-model="dialogSignOut" width="unset">
      <v-card>
        <v-card-title class="headline lighten-2 blue--text">
          Bạn có chắc muốn đăng xuất không?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogSignOut = false"
            >Không</v-btn
          >
          <v-btn color="blue darken-1" text @click="signOut()">Có</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          text: 'Quản lý bệnh viện',
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
        {
          icon: 'mdi-chart-bubble',
          text: 'Quản lý kê đơn thuốc',
          active: false,
          subLinks: [
            {
              icon: 'mdi-chart-bubble',
              text: 'Danh sách thuốc',
              to: '/list/old_core/medicine/medicines',
            },
            {
              icon: 'mdi-chart-bubble',
              text: 'Quản lý đơn thuốc',
              // to: '/list/old_core/medicine/medicines',
            },
            {
              icon: 'mdi-chart-bubble',
              text: 'Kê toa thuốc',
              to: '/list/old_core/dashboard/dashboards',
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
          // console.log('?sss?????', user)
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
