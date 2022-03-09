<template>
  <v-form id="edit-form" ref="form" v-model="valid" lazy-validation>
    <v-toolbar flat>
      <!-- <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="backToList()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Quay lại danh sách phòng ban </span>
      </v-tooltip> -->

      <v-toolbar-title v-if="isEdit" class="blue--text font-weight-bold">{{
        `Kê đơn thuốc: ${title_name}`
      }}</v-toolbar-title>
      <v-toolbar-title v-if="!isEdit" class="blue--text font-weight-bold">{{
        `Thêm đơn thuốc `
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
        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-text-field
            v-model="department.code"
            label="Số phiếu"
            outlined
            dense
            class="required"
            color="red"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-text-field
            v-model="department.name"
            label="Mã bệnh nhân"
            outlined
            dense
            class="required"
            color="red"
          ></v-text-field>
        </v-col>

        <!-- <v-col cols="12" sm="6"
                  lg="6"
                  xl="6"
                  md="6">
            <v-text-field
              v-model="department.plain_name"
              label="Tên không dấu"
              outlined
              dense
            ></v-text-field>
          </v-col> -->

        <!-- <v-col cols="12" sm="6" lg="6" xl="6" md="6">
            <v-text-field
              v-model="department.name_en"
              label="Tên_En"
              outlined
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" lg="6" xl="6" md="6">
            <v-text-field
              v-model="department.name_ru"
              label="Tên_Ru"
              outlined
              dense
            ></v-text-field>
          </v-col> -->

        <v-col cols="12" sm="6" lg="6" xl="4" md="6">
          <v-text-field
            v-model.number="department.level"
            label="Tên bệnh nhân"
            maxlength="1"
            :rules="[numberRule]"
            outlined
            dense
            class="required"
            color="red"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-text-field
            v-model.number="department.level"
            label="Giới tính"
            maxlength="1"
            :rules="[numberRule]"
            outlined
            dense
            class="required"
            color="red"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-autocomplete
            v-model="department.department_parent"
            label="Năm sinh"
            :items="departments_parent_list"
            item-text="name"
            item-value="id"
            return-object
            outlined
            dense
            clearable
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-autocomplete
            v-model="department.department_parent"
            label="Đối tượng"
            :items="departments_parent_list"
            item-text="name"
            item-value="id"
            return-object
            outlined
            dense
            clearable
          ></v-autocomplete>
        </v-col>
        <!-- <v-col cols="12" sm="6"
                  lg="6"
                  xl="6"
                  md="6">
            <v-text-field
              v-model.number="department.clinic_type_id"
              label="loại phòng bệnh"
            outlined
              dense></v-text-field>
          </v-col> -->

        <v-col cols="12" sm="6" xl="2" md="6">
          <v-text-field
            v-model="department.manager"
            label="Dược phẩm"
            outlined
            dense
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-text-field
            v-model.number="department.idx"
            label="Số ngày"
            :rules="[numberRule]"
            outlined
            dense
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-text-field
            v-model.number="department.costcenter_id"
            label="Hạn sử dụng"
            outlined
            :rules="[numberRule]"
            dense
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-autocomplete
            v-model="department.department_parent"
            label="Đơn vị tính"
            :items="departments_parent_list"
            item-text="name"
            item-value="id"
            return-object
            outlined
            dense
            clearable
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" lg="6" xl="2" md="6">
          <v-text-field
            v-model.number="department.costcenter_id"
            label="Số lượng tồn"
            outlined
            :rules="[numberRule]"
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

const updatedepartmentGraphl = gql`
  mutation MyMutation(
    $id: Int
    $superior_id: Int
    $plain_name: String
    $name: String
    $manager: String
    $is_pause: Boolean
    $in_service: Boolean
    $idx: Int
    $hrm: Boolean
    $department_type_id: Int
    $costcenter_id: Int
    $code: String
    $clinic_type_id: Int
    $level: Int
    $name_en: String
    $name_ru: String
    $internal_hospital_id: Int
  ) {
    update_departments(
      where: { id: { _eq: $id } }
      _set: {
        clinic_type_id: $clinic_type_id
        code: $code
        costcenter_id: $costcenter_id
        department_type_id: $department_type_id
        hrm: $hrm
        in_service: $in_service
        is_pause: $is_pause
        manager: $manager
        name: $name
        plain_name: $plain_name
        superior_id: $superior_id
        idx: $idx
        level: $level
        name_en: $name_en
        name_ru: $name_ru
        internal_hospital_id: $internal_hospital_id
      }
    ) {
      affected_rows
    }
  }
`

export default {
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
    valid: false,
    isEdit: true,
    dialogSave: false,
    user: {},
    permission: {},
    departments_parent_list: [],
    snackbar: false,
    textSnackbar: '',
    department_types: [],
    hospitals: [],
    numberRule: (v) => {
      if (v) {
        if (/^[0-9-/]*$/.test(v)) {
          return true
        } else {
          return 'Không được có khoảng trắng và kí tự'
        }
      }
    },
    department: {
      id: '',
      code: '',
      department_type_id: null,
      level: 1,
      superior_id: null,
      manager: null,
      clinic_type_id: null,
      is_pause: false,
      plain_name: null,
      in_service: false,
      idx: null,
      hrm: false,
      costcenter_id: null,
      internal_hospital_id: null,

      department_type: { id: null, name: null },
      department_parent: { id: null, name: null },
      hospital: { id: null, name: null },
    },
  }),
  apollo: {
    // department_types: {
    //   query: gql(`query MyQuery {
    //     department_types {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.department_types = data.department_types
    //     // this.department.department_type = data.department_types[0]
    //   },
    // },
    departments_parent_list: {
      query: gql(`query MyQuery {
        departments(where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
      }`),
      update: (data) => {},
      result({ data }) {
        this.departments_parent_list = data.departments
      },
    },

    departments: {
      query() {
        const query = gql(`query MyQuery {
          department_types(where: {internal_hospital_id: {_eq: ${localStorage.getItem(
            'hospital'
          )}}}) {
          id
          name
        }
         internal_hospitals {
          id
          name
        }
        departments(where: {id: {_eq: ${this.objId}}}) {
          clinic_type_id
                      code
                      costcenter_id
                      department_type_id
                      hrm
                      id
                      idx
                      in_service
                      is_pause
                      level
                      manager
                      name
                      plain_name
                      superior_id
                      name_en
                      name_ru
                      department_type {
                        id
                        name
                      }
                      department_parent {
                        id
                        name
                      }
                      internal_hospital{
                        id
                        name
                      }
                      
        }
      }`)
        return query
      },
      update: (data) => {},
      result({ data }) {
        this.department_types = data.department_types
        this.hospitals = data.internal_hospitals
        if (
          data === undefined ||
          data === [] ||
          data.departments.length === 0
        ) {
          this.department.department_type = data.department_types[0]
          this.department.internal_hospital = data.internal_hospitals[0]
          console.log('add department screen')
        } else {
          this.department = data.departments[0]
          console.log(this.department)
          this.title_name = this.department.name
          if (this.department.department_type === null) {
            this.department.department_type = { id: null, name: null }
          }
          if (this.department.department_parent === null) {
            this.department.department_parent = { id: null, name: null }
          }
          if (this.department.internal_hospital === null) {
            this.department.internal_hospital = { id: null, name: null }
          }
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
              permission_group_details(where: {permission: {code: {_eq: "departments"}}}){
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
      this.departments = []
    },
    save() {
      this.dialogSave = false
      if (this.checkInfo()) {
        return
      }
      if (this.isEdit === true) {
        this.updatedepartmentFunction()
      } else {
        this.adddepartmentFunction2()
      }
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
    backToList() {
      this.$router.push({
        path: `/list/old_core/department/departments`,
      })
    },
    checkInfo() {
      if (this.department.name === '') {
        this.textSnackbar = 'Vui lòng nhập tên'
        this.snackbar = true
        return true
      }
      if (this.department.code === '') {
        this.textSnackbar = 'Vui lòng nhập mã phòng'
        this.snackbar = true
        return true
      }
      if (this.department.level === '') {
        this.textSnackbar = 'Vui lòng nhập cấp'
        this.snackbar = true
        return true
      }

      return false
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
    updatedepartmentFunction() {
      this.department.plain_name = this.convertViToEn(this.department.name)
      console.log(this.department.department_parent)
      this.$apollo.mutate({
        mutation: updatedepartmentGraphl,
        variables: {
          id: this.department.id,
          clinic_type_id: this.department.clinic_type_id,
          code: this.department.code,
          costcenter_id: this.department.costcenter_id,
          department_type_id: this.department.department_type.id,
          hrm: this.department.hrm,
          in_service: this.department.in_service,
          is_pause: this.department.is_pause,
          manager: this.department.manager,
          name: this.department.name,
          plain_name: this.department.plain_name,
          superior_id: this.department.department_parent.id,
          level: this.department.level,
          idx: this.department.idx,
          name_en: this.department.name_en,
          name_ru: this.department.name_ru,
          internal_hospital_id: this.department.internal_hospital.id,
        },
        update: (store, { data: { update_departments } }) => {
          if (update_departments.affected_rows) {
            // eslint-disable-next-line
            this.$apollo.queries.departments.refetch()
            this.textSnackbar = 'Đã cập nhật phòng ban thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Cập nhật phòng ban thất bại'
            this.snackbar = true
          }
        },
      })
    },
    awaitDirect() {
      setTimeout(() => this.backToList(), 1500)
    },
    adddepartmentFunction2() {
      this.department.plain_name = this.convertViToEn(this.department.name)
      const data_departments = {}

      data_departments.clinic_type_id = this.department.clinic_type_id
      data_departments.code = this.department.code
      data_departments.costcenter_id = this.department.costcenter_id
      data_departments.department_type_id = this.department.department_type.id
      data_departments.hrm = this.department.hrm
      data_departments.in_service = this.department.in_service
      data_departments.is_pause = this.department.is_pause
      data_departments.manager = this.department.manager
      data_departments.name = this.department.name
      data_departments.plain_name = this.department.plain_name
      data_departments.superior_id = this.department.department_parent.id
      data_departments.level = this.department.level
      data_departments.idx = this.department.idx

      data_departments.name_en = this.department.name_en
      data_departments.name_ru = this.department.name_ru
      data_departments.internal_hospital_id = this.department.internal_hospital.id

      console.log('data_departments', data_departments)
      const query = `mutation MyMutation($objects: [departments_insert_input!]!) {
            insert_departments(objects: $objects) {
              affected_rows
              returning {
                id
              }
            }
          }`
      console.log('query', query)
      this.$apollo.mutate({
        mutation: gql(query),
        variables: {
          objects: data_departments,
        },
        update: (store, { data: { insert_departments } }) => {
          if (insert_departments.affected_rows) {
            // eslint-disable-next-line
            this.textSnackbar = 'Thêm phòng ban thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Thêm phòng ban thất bại'
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
