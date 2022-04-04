<template>
  <v-form id="edit-form" ref="form" v-model="valid" lazy-validation>
    <v-toolbar flat>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="backToList()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Quay lại danh sách phòng khám </span>
      </v-tooltip>

      <v-toolbar-title v-if="isEdit" class="blue--text font-weight-bold">{{
        `Chỉnh sửa phòng khám: ${title_name}`
      }}</v-toolbar-title>
      <v-toolbar-title v-if="!isEdit" class="blue--text font-weight-bold">{{
        `Thêm phòng khám `
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn tile color="blue" :disabled="!valid" @click="dialogSave = true">
        <v-icon color="white" left>mdi-content-save</v-icon>
        Lưu
      </v-btn>

      <!-- <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>-->
    </v-toolbar>
    <v-dialog v-model="dialogSave" width="unset">
      <v-card>
        <v-card-title class="headline lighten-2 blue--text">
          Bạn có muốn lưu không?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogSave = false"
            >Không</v-btn
          >
          <v-btn color="blue darken-1" text @click="save()">Có</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card elevation="2" class="mx-auto" outlined>
      <v-row class="pa-5">
        <v-col cols="12" sm="6" lg="6" xl="6" md="6">
          <v-text-field
            v-model="clinic.code"
            label="Mã phòng khám"
            outlined
            dense
            class="required"
            color="red"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="6" md="6">
          <v-text-field
            v-model="clinic.name"
            label="Tên phòng khám"
            outlined
            dense
            class="required"
            color="red"
          ></v-text-field>
        </v-col>

        <!-- <v-col cols="12" sm="6" lg="6" xl="6" md="6">
          <v-autocomplete
            v-model="clinic.internal_hospital"
            label="Bệnh viện"
            :items="internal_hospitals"
            item-text="name"
            item-value="id"
            return-object
            outlined
            dense
          ></v-autocomplete>
        </v-col> -->

        <v-col cols="12" sm="6" lg="6" xl="6" md="6">
          <v-autocomplete
            v-model="clinic.department_type"
            label="Loại phòng ban"
            :items="department_types"
            item-text="name"
            item-value="id"
            return-object
            outlined
            dense
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="3" lg="3" xl="3" md="3" class="mt-n3">
          <v-checkbox
            v-model="clinic.is_pause"
            :label="`tạm ngưng`"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" sm="3" lg="3" xl="3" md="3" class="mt-n3">
          <v-checkbox
            v-model="clinic.hrm"
            :label="`Quản lý nhân sự`"
          ></v-checkbox>
        </v-col>

        <v-col v-if="clinic.hrm === true" cols="12" sm="6" lg="6" xl="6" md="6">
          <v-text-field
            v-model="clinic.manager"
            label="Trưởng phòng"
            outlined
            dense
            class="required"
            color="red"
          ></v-text-field>
        </v-col>
        <!-- <v-col v-if="clinic.hrm === true" cols="12" sm="6" lg="6" xl="6" md="6">
          <v-autocomplete
            v-model="clinic.employee"
            label="Trưởng phòng"
            :items="employees"
            item-text="fullname"
            item-value="id"
            return-object
            outlined
            dense
            clearable
          ></v-autocomplete>
        </v-col> -->

        <!-- <v-col cols="12" sm="6" lg="6" xl="6" md="6">
            <v-text-field
              v-model="clinic.name_en"
              label="Tên_En"
              outlined
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" lg="6" xl="6" md="6">
            <v-text-field
              v-model="clinic.name_ru"
              label="Tên_Ru"
              outlined
              dense
            ></v-text-field>
          </v-col> -->

        <!-- <v-col cols="12" sm="6"
                  lg="6"
                  xl="6"
                  md="6">
            <v-text-field
              v-model.number="clinic.clinic_type_id"
              label="loại phòng bệnh"
            outlined
              dense></v-text-field>
          </v-col> -->

        <v-col cols="12" sm="6" lg="6" xl="6" md="6">
          <v-text-field
            v-model.number="clinic.idx"
            label="idx"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <v-row> </v-row>
    <v-snackbar v-model="snackbar">
      {{ textSnackbar }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-form>
</template>

<script>
/* eslint-disable camelcase */
import gql from 'graphql-tag'
import firebase from 'firebase'
const updateclinicGraphl = gql`
  mutation MyMutation(
    $id: Int
    $plain_name: String
    $name: String
    $manager: String
    $is_pause: Boolean
    $idx: Int
    $hrm: Boolean
    $code: String
    $name_en: String
    $name_ru: String
    $department_type_id: Int
  ) {
    update_clinics(
      where: { id: { _eq: $id } }
      _set: {
        code: $code
        hrm: $hrm
        is_pause: $is_pause
        manager: $manager
        name: $name
        plain_name: $plain_name
        idx: $idx
        name_en: $name_en
        name_ru: $name_ru
        department_type_id: $department_type_id
      }
    ) {
      affected_rows
    }
  }
`

export default {
  name: 'ClinicEdit',
  asyncData({ route, params }) {
    let objId = 0
    if (route.query.id != null && route.query.id !== undefined) {
      objId = route.query.id
    }
    let isEdit = false
    if (objId !== null && objId !== '0') {
      isEdit = true
    }
    return { objId, isEdit }
  },
  data: () => ({
    valid: true,
    isEdit: true,
    dialogSave: false,
    clinics: [],
    snackbar: false,
    user: {},
    permission: {},
    textSnackbar: '',
    title_name: '',
    employees: [],
    internal_hospitals: [],
    department_types: [],
    clinic: {
      id: '',
      code: '',
      name: '',
      manager: null,
      is_pause: false,
      plain_name: null,
      idx: null,
      hrm: false,
      name_en: null,
      name_ru: null,
      employee: { id: null, fullname: null },
      internal_hospital: { id: null, code: null },
      department_type: { id: null, name: null },
    },
  }),
  apollo: {
    // employees: {
    //   query: gql(`query MyQuery {
    //     employees {
    //       id
    //       fullname
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.employees = data.employees
    //   },
    // },
    // internal_hospitals: {
    //   query: gql(`query MyQuery {
    //     internal_hospitals(where: {level: {_eq: 1}}) {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.internal_hospitals = data.internal_hospitals
    //     console.log('1')
    //   },
    // },
    clinics: {
      query() {
        const query = gql(`query MyQuery {
       department_types(order_by: {created_at: desc},where: {internal_hospital_id: {_eq: ${localStorage.getItem(
         'hospital'
       )}}}) {
                      id
                      name
                      code
                    }

        internal_hospitals(order_by: {created_at: desc}) {
                      id
                      name
                      code
                    }
        clinics(where: {id: {_eq: ${this.objId}}}) {
         code
                      hrm
                      created_at
                      idx
                      id
                      is_pause
                      manager
                      name
                      name_en
                      name_ru
                      ref_id
                      updated_at
                      plain_name
               department_type{
                 id
                 name
               }
                      internal_hospital {
                        id
                        name
                        code
                      }
        }
      }`)
        return query
      },
      update: (data) => {},
      result({ data }) {
        this.internal_hospitals = data.internal_hospitals
        this.department_types = data.department_types
        if (data === undefined || data === [] || data.clinics.length === 0) {
          this.clinic.internal_hospital = this.internal_hospitals[0]
          this.clinic.department_type = this.department_types[0]
        } else {
          this.clinic = data.clinics[0]
          this.title_name = this.clinic.name
          if (this.clinic.department_type === null) {
            this.clinic.department_type = { id: null, name: null }
          }
          if (this.clinic.internal_hospital === null) {
            this.clinic.internal_hospital = { id: null, code: null }
          }
          console.log('2')
        }
      },
    },
  },

  computed: {},

  watch: {},
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user.id = user.uid
        this.user.email = user.email
        const querySearch = gql`
        query MyQuery {
          users(
            where: { id: { _eq: "${this.user.id}" } }
          ) {
            id
              permission_group {
              id
              code
              name
              permission_group_details(where: {permission: {code: {_eq: "clinics"}}}){
                id
                  is_delete
                  is_edit
                  is_export
                  is_import
                  is_view
                  created_at
                  is_add
                  permission {
                    code
                    id
                    name
                  }

                  permission_group_id
                  permission_id
                  updated_at
              }
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
              this.permission =
                response.data.users[0].permission_group.permission_group_details[0]
              if (this.isEdit && !this.permission.is_edit) {
                this.pushTo()
              } else if (!this.isEdit && !this.permission.is_add) {
                this.pushTo()
              }
            }
          })
          .catch((response) => console.log(response))
      } else {
        this.$router.replace({
          name: 'login',
          path: '',
        })
      }
    })
  },
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      this.clinics = []
    },
    pushTo() {
      this.$toast.error(`Tài khoản không có quyền truy cập trang này`, {
        duration: 2000,
        position: 'top-center',
      })
      setTimeout(
        () =>
          this.$router.push({
            path: `/dashboard`,
          }),
        1500
      )
    },
    convertViToEn(str, toUpperCase = true) {
      str = str.toLowerCase()
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      str = str.replace(/đ/g, 'd')
      // Some system encode vietnamese combining accent as individual utf-8 characters
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư

      return toUpperCase ? str.toUpperCase() : str
    },
    save() {
      this.dialogSave = false
      if (this.checkInfo()) {
        return
      }

      if (this.isEdit === true) {
        this.updateclinicFunction()
      } else {
        this.addclinicFunction2()
      }
    },
    awaitDirect() {
      setTimeout(() => this.backToList(), 1500)
    },
    backToList() {
      this.$router.push({
        path: `/list/old_core/medicine/medicines`,
      })
    },
    updateclinicFunction() {
      this.clinic.plain_name = this.convertViToEn(this.clinic.name)
      this.$apollo.mutate({
        mutation: updateclinicGraphl,
        variables: {
          id: this.clinic.id,
          code: this.clinic.code,
          hrm: this.clinic.hrm,
          is_pause: this.clinic.is_pause,
          manager: this.clinic.manager,
          name: this.clinic.name,
          plain_name: this.clinic.plain_name,
          idx: this.clinic.idx,
          name_en: this.clinic.name_en,
          name_ru: this.clinic.name_ru,
          department_type_id: this.clinic.department_type.id,
        },
        update: (store, { data: { update_clinics } }) => {
          if (update_clinics.affected_rows) {
            // eslint-disable-next-line
            this.$apollo.queries.clinics.refetch()
            this.textSnackbar = 'Đã cập nhật phòng khám thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Cập nhật phòng khám thất bại'
            this.snackbar = true
          }
        },
      })
    },
    checkInfo() {
      if (this.clinic.name === '' || this.clinic.name === null) {
        this.textSnackbar = 'Vui lòng nhập tên'
        this.snackbar = true
        return true
      }

      if (this.clinic.code === '' || this.clinic.code === null) {
        this.textSnackbar = 'Vui lòng nhập mã'
        this.snackbar = true
        return true
      }
      if (
        this.clinic.internal_hospital === undefined ||
        this.clinic.internal_hospital === null ||
        this.clinic.internal_hospital.id === null
      ) {
        this.textSnackbar = 'Vui lòng chọn bệnh viện'
        this.snackbar = true
        return true
      }
      if (
        this.clinic.hrm &&
        (this.clinic.manager === '' || this.clinic.manager === null)
      ) {
        this.textSnackbar = 'Vui lòng nhập tên quản lý'
        this.snackbar = true
        return true
      }
      return false
    },
    addclinicFunction2() {
      const data_clinics = {}

      data_clinics.code = this.clinic.code
      data_clinics.hrm = this.clinic.hrm
      data_clinics.is_pause = this.clinic.is_pause
      data_clinics.manager = this.clinic.manager
      data_clinics.name = this.clinic.name
      data_clinics.plain_name = this.clinic.plain_name
      data_clinics.idx = this.clinic.idx
      data_clinics.name_en = this.clinic.name_en
      data_clinics.name_ru = this.clinic.name_ru
      data_clinics.internal_hospital_id = localStorage.getItem('hospital')
      data_clinics.department_type_id = this.clinic.department_type.id

      const query = `mutation MyMutation($objects: [clinics_insert_input!]!) {
            insert_clinics(objects: $objects) {
              affected_rows
              returning {
                id
              }
            }
          }`
      this.$apollo.mutate({
        mutation: gql(query),
        variables: {
          objects: data_clinics,
        },
        update: (store, { data: { insert_clinics } }) => {
          if (insert_clinics.affected_rows) {
            // eslint-disable-next-line
            this.$apollo.queries.clinics.refetch()
            this.textSnackbar = 'Thêm phòng khám thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Thêm phòng khám thất bại'
            this.snackbar = true
          }
        },
      })
    },
  },
}
</script>
<style scoped lang="css"></style>
<style>
.required label::after {
  content: ' * ';
  color: red;
}
.required .v-label {
  color: red;
  opacity: 1;
}
</style>
