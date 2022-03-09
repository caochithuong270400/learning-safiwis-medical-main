<template>
  <v-app dark>
    <!-- <v-navigation-drawer
      v-if="isLogin"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      class="mx-auto"
      fixed
      app
      disable-route-watcher
      disable-resize-watcher
      width="280"
    >
      <v-list nav dense>
        <div v-for="(link, i) in links" :key="i">
          <v-list-item v-if="!link.subLinks" :to="link.to" class="v-list-item">
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-title color="pink" v-text="link.text" />
          </v-list-item>
          <v-list-group
            v-else
            :key="link.text"
            no-action
            :prepend-icon="link.icon"
            :value="false"
          >
            <template #activator>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </template>

            <v-list-item
              v-for="sublink in link.subLinks"
              :key="sublink.text"
              :to="sublink.to"
            >
              <v-list-item-title>{{ sublink.text }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer> -->
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
    <v-app-bar color="blue" v-if="isLogin" :clipped-left="clipped" fixed app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <v-row justify="space-around">
        <v-btn min-width="0" dark text to="/dashboard">
          <v-icon>mdi-home-circle</v-icon>
        </v-btn>
        <v-menu
          v-for="(link, i) in links"
          :key="i"
          :close-on-content-click="closeMenu"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="!link.subLinks"
              :to="link.to"
              color="white"
              dark
              v-bind="attrs"
              v-on="on"
            >
              {{ link.text }}
            </v-btn>
            <v-btn
              v-else
              :to="link.to"
              color="white"
              dark
              v-bind="attrs"
              v-on="on"
            >
              {{ link.text }}
            </v-btn>
          </template>
          <v-list dense>
            <v-div v-for="sublink in link.subLinks" :key="sublink.text">
              <v-list-item
                v-if="!sublink.child"
                :to="sublink.to"
                color="primary"
                @click="closeMenu = true"
              >
                <v-list-item-title>{{ sublink.text }}</v-list-item-title>
                <!-- <v-list-group v-else :value="true" no-action>
                <template #activator>
                  <v-list-item-title>{{ sublink.text }}</v-list-item-title>
                </template>
                <v-list-item
                  v-for="subChild in sublink.child"
                  :key="subChild.text"
                  :to="subChild.to"
                  color="primary"
                >
                  <v-list-item-title>{{ subChild.text }}</v-list-item-title>
                </v-list-item>
              </v-list-group> -->
              </v-list-item>
              <v-list-group
                v-else
                color="blue"
                v-model="openSubGroup"
                :value="true"
                no-action
              >
                <template #activator>
                  <v-list-item-title>{{ sublink.text }}</v-list-item-title>
                </template>
                <v-divider inset></v-divider>
                <v-list-item
                  v-for="subChild in sublink.child"
                  :key="subChild.text"
                  :to="subChild.to"
                  color="primary"
                  @click="closeMenu = true"
                >
                  <v-list-item-title>{{ subChild.text }}</v-list-item-title>
                </v-list-item>
              </v-list-group>
            </v-div>
          </v-list>
          <!-- <v-list nav dense>
          <div v-for="(link, i) in links" :key="i">
            <v-list-item
              v-if="!link.subLinks"
              :to="link.to"
              class="v-list-item"
            >
              <v-list-item-icon>
                <v-icon>{{ link.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-title color="pink" v-text="link.text" />
            </v-list-item>
            <v-list-group
              v-else
              :key="link.text"
              no-action
              :prepend-icon="link.icon"
              :value="false"
            >
              <template #activator>
                <v-list-item-title>{{ link.text }}</v-list-item-title>
              </template>

              <v-list-item
                v-for="sublink in link.subLinks"
                :key="sublink.text"
                :to="sublink.to"
              >
                <v-list-item-title>{{ sublink.text }}</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </div>
        </v-list> -->
        </v-menu>
      </v-row>
      <v-spacer />

      <!-- <v-text-field
        :label="'Tìm kiếm'"
        color="secondary"
        hide-details
        style="max-width: 165px"
      >
        <template v-if="$vuetify.breakpoint.mdAndUp" #append-outer>
          <v-btn class="mt-n2" elevation="1" fab small>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-text-field> -->
      <v-btn class="ml-2" dark min-width="0" text>
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>
      <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
      >
        <template #activator="{ attrs, on }">
          <v-btn class="ml-2" dark min-width="0" text v-bind="attrs" v-on="on">
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
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import firebase from 'firebase'
export default {
  layout: 'Default',
  asyncData({ route, params }) {
    console.log('tempssss')
  },
  data() {
    return {
      items: [
        {
          action: 'local_activity',
          title: 'Attractions',
          items: [{ title: 'List Item' }],
        },
        {
          action: 'restaurant',
          title: 'Dining',
          active: true,
          items: [
            { title: 'Breakfast & brunch' },
            { title: 'New American' },
            { title: 'Sushi' },
          ],
        },
      ],
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
        // {
        //   icon: 'mdi-apps',
        //   text: 'Trang chủ',
        //   to: '/dashboard',
        // },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'Inspire',
        //   to: '/inspire',
        // },
        {
          icon: 'mdi-chart-bubble',
          text: 'Quản lý bệnh viện',
          // to: '/list/old_core/patients',
          subLinks: [
            {
              icon: 'mdi-chart-bubble',
              text: 'Danh sách bệnh nhân',
              to: '/list/old_core/patient/patients',
            },
            {
              icon: 'mdi-chart-bubble',
              text: 'Danh sách nhân viên',
              to: '/list/old_core/employee/employees',
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
              text: 'Danh sách phòng khám',
              to: '/list/old_core/clinic/clinics',
            },
            {
              icon: 'mdi-chart-bubble',
              text: 'Lịch làm việc',
              to: '/list/old_core/clinic/schedules_doctor_clinic',
            },
          ],
        },
       
        {
          icon: 'mdi-chart-bubble',
          text: 'Cài đặt',
          // to: '/list/old_core/patients',
          subLinks: [
            {
              icon: 'mdi-chart-bubble',
              text: 'Cài đặt người dùng',
              to: '',
              child: [
                {
                  icon: 'mdi-chart-bubble',
                  text: 'Danh sách người dùng',
                  to: '/list/old_core/user/users',
                },
                {
                  icon: 'mdi-chart-bubble',
                  text: 'Phần quyền người dùng',
                  to: '',
                },
              ],
            },
          ],
        },
        // {
        //   icon: 'mdi-apps',
        //   title: 'login',
        //   to: '/user/login',
        // },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: '',
    }
  },

  computed: {
    // isLogin() {
    //   return this.$store.state.user.editUserData.isLogin
    // },
  },
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
      // const temp = this.$store.state.data
      // console.log('tempdata22', temp)
      // if (temp.editData != null) {
      //   this.user.id = temp.editData.id
      //   this.user.email = temp.editData.email
      // }

      // this.signOut()
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user.id = user.uid
          this.user.email = user.email
          // update data or vuex state
          this.isLogin = true
        } else {
          this.$router.replace({
            name: 'login',
            path: '',
          })
        }
      })
    },
    openDialogSignout() {
      this.closeMenu = true
      this.dialogSignOut = true
    },
    signOut() {
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
</style>
