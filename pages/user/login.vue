<template>
  <!-- <v-main> -->

  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md3 lg3>
      <!-- <v-dialog v-model="dialogSignOut" width="unset">
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
      </v-dialog> -->
      <v-card class="elevation-1 pa-3">
        <!-- <v-overlay
          v-if="hospitalDialog"
          :absolute="true"
          :opacity="1"
          :value="hospitalDialog"
        >
          <v-dialog
            v-model="hospitalDialog"
            persistent
            transition="dialog-bottom-transition"
          >
            <v-sheet outlined color="blue" rounded>
              <v-card>
                <v-card-title class="headline blue--text"
                  >Chọn bệnh viện</v-card-title
                >
                <v-data-table
                  :headers="headerHospital"
                  :items="internal_hospitals"
                  item-key="id"
                  class="elevation-1 pa-5"
                  disable-pagination
                  hide-default-footer
                >
                  <template #[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="chooseHospital(item)">
                      mdi-check
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card>
            </v-sheet>
          </v-dialog>
        </v-overlay> -->
        <v-card-text>
          <div class="layout column align-center">
            <img
              src="../../static/logo-taimuihongsg.jpg"
              alt="Logo"
              height="120"
              class="logo"
            />
            <h2 class="flex my-4 primary--text" align="center">
              Hệ thống quản lý bệnh viện
            </h2>
          </div>
          <v-form>
            <v-text-field
              v-model="model.username"
              prepend-icon="mdi-account"
              name="login"
              label="Tên đăng nhập"
              type="text"
              @keyup.enter="login"
            ></v-text-field>
            <v-text-field
              id="password"
              v-model="model.password"
              prepend-icon="mdi-lock"
              name="password"
              label="Mật khẩu"
              type="password"
              @keyup.enter="login"
            ></v-text-field>
            <v-autocomplete
              v-model="internal_hospital"
              label="Bệnh viện"
              :items="internal_hospitals"
              item-text="name"
              item-value="id"
              prepend-icon="mdi-hospital-building"
              return-object
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <!-- <v-card-actions> -->
        <v-col align="center" class="mt-n5">
          <v-btn
            block
            color="primary"
            :loading="loading"
            width="15"
            @click="login"
            >Đăng nhập</v-btn
          >
        </v-col>

        <!-- </v-card-actions> -->
      </v-card>
    </v-flex>
  </v-layout>
  <!-- </v-main> -->
</template>

<script>
import gql from 'graphql-tag'
// import store from 'store2'
import firebase from 'firebase'
export default {
  layout: 'auth',
  data: () => ({
    hospitalDialog: false,
    internal_hospitals: [],
    internal_hospital: {},
    dialogSignOut: false,
    loading: false,
    booleanUser: false,
    model: {
      username: '',
      password: '',
    },
    tempData: {},
    error: null,
    headerHospital: [
      {
        text: 'STT',
        value: 'stt',
        align: 'start',
        sortable: false,
        class: 'blue darken-3 font-weight-medium text-h4 white--text',
      },

      {
        text: 'Tên bệnh viện',
        value: 'name',
        class: 'blue darken-3 font-weight-medium text-h4 white--text',
      },

      {
        text: '',
        value: 'actions',
        sortable: false,
        class: 'blue darken-3 font-weight-medium text-h4 white--text',
      },
    ],
  }),
  apollo: {
    internal_hospitals: {
      query: gql(`query MyQuery {
                    internal_hospitals(order_by: {id: asc}) {
                      id
                      name

                    }
                  }
               `),
      update: (data) => {},
      result({ data }) {
        this.internal_hospitals = data.internal_hospitals
        this.internal_hospital = this.internal_hospitals[1]
        for (let index = 0; index < this.internal_hospitals.length; index++) {
          const element = this.internal_hospitals[index]
          element.stt = index + 1
        }
      },
    },
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && this.booleanUser === false) {
        this.checkUser(user)
        // this.$router.push({
        //   path: '/dashboard',
        // })
      }
    })
  },
  mounted() {
    // window.addEventListener('beforeunload', this.unload)
    // console.log('asd', store.session.get('addMeTo'))
    // if (store.session.get('addMeTo') === null) {
    //   store('addMeTo', 'sessionStorasssge')
    // }
    // console.log('asdssss', store.session.get('addMeTo'))
  },
  methods: {
    unload(e) {
      return 'Do you really want to close?'
    },

    signOut() {
      console.log('signout')
      this.isLogin = false
      firebase
        .auth()
        .signOut()
        .then(() => {})
    },
    chooseHospital(item) {
      localStorage.setItem('hospital', item.id)
      // localStorage.setItem('recipeDataKey', JSON.stringify(this.recipeData));
      this.directRoute()
    },
    checkUser(user) {
      const querySearch = gql`
        query MyQuery {
          users(
            where: { id: { _eq: "${user.uid}" } }
          ) {
            id
            role

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
            // this.hospitalDialog = true
            this.directRoute()
          }
        })
        .catch((response) => console.log(response))
    },
    async directRoute() {
      // if (this.booleanUser) {
      this.$toast.success(`Đăng nhập thành công`, {
        duration: 5000,
        position: 'top-center',
      })
      // } else {
      //   this.$toast.success(`Chọn bệnh viện thành công`, {
      //     duration: 5000,
      //     position: 'top-center',
      //   })
      // }

      let objId = null
      if (
        this.$route.query.link != null &&
        this.$route.query.link !== undefined
      ) {
        objId = this.$route.query.link
      }
      if (objId !== null && objId !== '0') {
        await setTimeout(() => {
          this.$router.push(`/${objId}`)
        }, 1000)
      } else {
        await setTimeout(() => {
          this.$router.push('/dashboard')
        }, 1000)
      }
    },
    login() {
      // this.$router.push('/dashboard')
      // setTimeout(() => {
      //   this.$router.push('/dashboard')
      // }, 1000)
      if (this.model.username === '' || this.model.password === '') {
        this.error = 'Vui lòng nhập tên đăng nhập/mật khẩu'
      } else {
        // LƯu data
        // this.$store.commit('user/setUserData', this.employees)

        // Lấy data
        // const temp = this.$store.state.user.editUserData

        this.loading = true
        firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(async () => {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            await firebase
              .auth()
              .signInWithEmailAndPassword(
                this.model.username,
                this.model.password
              )
              .then((response) => {
                this.chooseHospital(this.internal_hospital)
                this.booleanUser = true
                // this.checkUser(response.user)
                // commit('setUser', response.user.uid)
                // commit('setStatus', 'success')
                // commit('setError', null)
                // var token = await response.user.getIdToken(true)
                // commit('setToken', token)
                // resolve(response)
                // resolve('OK')
                // this.$toast.success(`Đăng nhập thành công`, {
                //   duration: 5000,
                //   position: 'top-center',
                // })
                // window.addEventListener('beforeunload', this.signOut)
                // window.addEventListener('beforeunload', function (e) {
                //   const confirmationMessage = 'o/'
                //   ;(e || window.event).returnValue = confirmationMessage
                //   console.log(confirmationMessage)
                //   console.log('e', e)
                //   console.log('returnValue', (e || window.event).returnValue)
                // })
                // firebase.auth().onAuthStateChanged((user) => {
                //   const userData = {
                //     id: response.user.uid,
                //     email: response.user.email,
                //   }
                //   this.$store.commit('data/setData', userData)
                // })
              })
              .catch((error) => {
                // commit('setStatus', 'failure')
                // commit('setError', error.message)
                // reject(error)
                switch (error.code) {
                  case 'auth/user-not-found':
                  case 'auth/wrong-password':
                    this.$toast.error(`Tài khoản hoặc mật khẩu không đúng`, {
                      duration: 5000,
                      position: 'top-center',
                    })
                    break
                  default:
                    this.$toast.error(`Đăng nhập thất bại`, {
                      duration: 5000,
                      position: 'top-center',
                    })
                }
                console.log(error)

                this.loading = false
              })
          })
          .catch((error) => {
            // Handle Errors here.
            console.log(error)
          })
      }
    },
  },
}
</script>
<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  z-index: 0;
}
.logo {
  max-width: 100%; /* only this one important */
}
</style>
