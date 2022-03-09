<template>
  <v-container fluid style="margin: 0px; padding: 0px; width: 100%">
    <v-form id="edit-form" ref="form" v-model="valid" lazy-validation>
      <v-toolbar flat>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="backToList()">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Quay lại danh sách đơn vị bệnh viện </span>
        </v-tooltip>

        <v-toolbar-title v-if="isEdit" class="blue--text font-weight-bold">{{
          `Chỉnh sửa đơn vị bệnh viện: ${title_name}`
        }}</v-toolbar-title>
        <v-toolbar-title v-if="!isEdit" class="blue--text font-weight-bold">{{
          `Thêm đơn vị bệnh viện `
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
              v-model="hospital_unit.code"
              label="Mã đơn vị bệnh viện"
              outlined
              dense
              class="required"
              color="red"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" lg="6" xl="6" md="6">
            <v-text-field
              v-model="hospital_unit.name"
              label="Tên đơn vị bệnh viện"
              outlined
              dense
              class="required"
              color="red"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" lg="6" xl="6" md="6">
            <v-autocomplete
              v-model="department"
              label="Phòng ban"
              :items="departments"
              item-text="name"
              item-value="id"
              return-object
              outlined
              dense
            ></v-autocomplete>
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
  </v-container>
</template>

<script>
/* eslint-disable camelcase */
import gql from 'graphql-tag'
import firebase from 'firebase'

const updatehospital_unitGraphl = gql`
  mutation MyMutation(
    $id: Int
    $name: String
    $plain_name: String
    $code: String
    $objects3: [department_hospital_units_insert_input!]!
  ) {
    update_hospital_units(
      where: { id: { _eq: $id } }
      _set: { code: $code, name: $name, plain_name: $plain_name }
    ) {
      affected_rows
    }

    insert_department_hospital_units(
      objects: $objects3
      on_conflict: {
        constraint: department_hospital_units_department_id_hospital_unit_id_key
        update_columns: [department_id, hospital_unit_id]
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
    department: {
      id: null,
      name: null,
    },
    permission: {},
    departments: [],
    snackbar: false,
    textSnackbar: '',
    listDepartmentHospitalUnits: {},
    numberRule: (v) => {
      if (v) {
        if (/^[0-9-/]*$/.test(v)) {
          return true
        } else {
          return 'Không được có khoảng trắng và kí tự'
        }
      }
    },
    hospital_unit: {
      id: '',
      code: '',
      name: '',
      plain_name: null,
    },
  }),
  apollo: {
    hospital_units: {
      query() {
        const query = gql(`query MyQuery {

         departments(order_by: {id: asc},where: {is_reception: {_eq: true},internal_hospital_id:{_eq: ${localStorage.getItem(
           'hospital'
         )}}}) {
          id
          name
        }
        hospital_units(where: {id: {_eq: ${this.objId}}}) {
                      code
                      
                      id
                     
                      name
                      plain_name
                     
                      department_hospital_units {
                        id
                        department_id
                        department{
                          id
                          name
                        }
                        hospital_unit_id
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
        this.departments = data.departments
        if (
          data === undefined ||
          data === [] ||
          data.hospital_units.length === 0
        ) {
          console.log('add hospital_unit screen')
        } else {
          this.hospital_unit = data.hospital_units[0]
          this.department = this.hospital_unit.department_hospital_units[0].department
          this.title_name = this.hospital_unit.name
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
              permission_group_details(where: {permission: {code: {_eq: "hospital_units"}}}){
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
      this.hospital_units = []
    },
    save() {
      this.dialogSave = false
      if (this.checkInfo()) {
        return
      }
      if (this.isEdit === true) {
        this.updatehospital_unitFunction()
      } else {
        this.addhospital_unitFunction2()
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
        path: `/list/old_core/hospital_unit/hospital_units`,
      })
    },
    checkInfo() {
      if (this.hospital_unit.name === '') {
        this.textSnackbar = 'Vui lòng nhập tên'
        this.snackbar = true
        return true
      }
      if (this.hospital_unit.code === '') {
        this.textSnackbar = 'Vui lòng nhập mã phòng'
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
    updatehospital_unitFunction() {
      this.hospital_unit.plain_name = this.convertViToEn(
        this.hospital_unit.name
      )
      const listTemp = []
      if (this.department.id != null) {
        const temp = {}
        temp.department_id = this.department.id
        temp.hospital_unit_id = this.hospital_unit.id
        listTemp.push(temp)
      }

      this.$apollo.mutate({
        mutation: updatehospital_unitGraphl,
        variables: {
          id: this.hospital_unit.id,
          code: this.hospital_unit.code,
          name: this.hospital_unit.name,
          plain_name: this.hospital_unit.plain_name,
          objects3: listTemp,
        },
        update: (store, { data: { update_hospital_units } }) => {
          if (update_hospital_units.affected_rows) {
            // eslint-disable-next-line
            this.$apollo.queries.hospital_units.refetch()
            this.textSnackbar = 'Đã cập nhật đơn vị bệnh viện thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Cập nhật đơn vị bệnh viện thất bại'
            this.snackbar = true
          }
        },
      })
    },
    awaitDirect() {
      setTimeout(() => this.backToList(), 1500)
    },
    addhospital_unitFunction2() {
      this.hospital_unit.plain_name = this.convertViToEn(
        this.hospital_unit.name
      )
      const data_hospital_units = {}
      data_hospital_units.code = this.hospital_unit.code
      data_hospital_units.name = this.hospital_unit.name
      data_hospital_units.plain_name = this.hospital_unit.plain_name
      data_hospital_units.internal_hospital_id = localStorage.getItem(
        'hospital'
      )
      if (this.department.id !== null) {
        data_hospital_units.department_hospital_units = {}
        data_hospital_units.department_hospital_units.data = {}
        data_hospital_units.department_hospital_units.data.department_id = this.department.id
      }

      console.log('data_hospital_units', data_hospital_units)
      const query = `mutation MyMutation($objects: [hospital_units_insert_input!]!) {
            insert_hospital_units(objects: $objects) {
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
          objects: data_hospital_units,
        },
        update: (store, { data: { insert_hospital_units } }) => {
          if (insert_hospital_units.affected_rows) {
            // eslint-disable-next-line
            this.textSnackbar = 'Thêm đơn vị bệnh viện thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Thêm đơn vị bệnh viện thất bại'
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
