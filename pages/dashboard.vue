<template>
  <v-form id="edit-form" ref="form" v-model="valid" lazy-validation>
    <v-toolbar flat>
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
      <v-btn tile color="blue" :disabled="!valid" @click="dialogSave = true">
        <v-icon color="white" left>mdi-cloud-print-outline</v-icon>
        In
      </v-btn>
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
      <v-tabs background-color="blue" dark no-animation>
        <v-tab>kê toa</v-tab>
        <v-tab-item
          v-for="n in 3"
          :key="n"
          :transition="false"
          :reverse-transition="false"
        >
          <v-container fluid style="background-color: white">
            <v-row class="pa-5">
              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model="department.code"
                  label="Số phiếu"
                  outlined
                  dense
                  class="required"
                  color="red"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model="department.name"
                  label="Mã bệnh nhân"
                  outlined
                  dense
                  class="required"
                  color="red"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" lg="4" xl="4" md="4">
                <v-text-field
                  v-model.number="department.level"
                  label="Tên bệnh nhân"
                  disabled
                  maxlength="1"
                  :rules="[numberRule]"
                  outlined
                  dense
                  class="required"
                  color="red"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model.number="department.level"
                  label="Giới tính"
                  disabled
                  maxlength="1"
                  :rules="[numberRule]"
                  outlined
                  dense
                  class="required"
                  color="red"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
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

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
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

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-autocomplete
                  v-model="department.department_parent"
                  label="Tên thuốc"
                  :items="medicines_list"
                  item-text="name"
                  item-value="id"
                  return-object
                  outlined
                  dense
                  clearable
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model.number="department.idx"
                  label="Số ngày"
                  :rules="[numberRule]"
                  outlined
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model.number="department.costcenter_id"
                  label="Hạn sử dụng"
                  outlined
                  disabled
                  :rules="[numberRule]"
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-autocomplete
                  v-model="department.department_parent"
                  label="Đơn vị tính"
                  :items="departments_parent_list"
                  item-text="name"
                  item-value="gender"
                  return-object
                  outlined
                  dense
                  clearable
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model.number="department.costcenter_id"
                  label="Số lượng tồn"
                  outlined
                  disabled
                  :rules="[numberRule]"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <client-only>
              <v-data-table
                :headers="headers"
                :items="patients"
                :server-items-length="getTotalData()"
                :items-per-page="itemsPerPage"
                :footer-props="{
                  itemsPerPageText: 'số dòng mỗi trang',
                  pageText: '{0}-{1} trên {2}',
                }"
                class="elevation-1"
                :loading="loading"
                loading-text="Đang tải...vui lòng đợi"
                @pagination="onPaginationChange"
                @update:options="paginate"
              >
                <template #top>
                  <v-snackbar v-model="snackbar">
                    {{ textSnackbar }}

                    <template v-slot:action="{ attrs }">
                      <v-btn
                        color="pink"
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
                      >
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                  <v-toolbar flat>
                    <v-btn
                      v-if="permission.is_add"
                      outlined
                      color="blue"
                      class="mb-2"
                      @click="add()"
                      align="center"
                    >
                      Thêm vào toa
                    </v-btn>

                    <v-dialog v-model="dialogDelete" width="unset">
                      <v-sheet outlined color="blue" rounded>
                        <v-card>
                          <v-card-title class="headline blue--text"
                            >Bạn có chắc xóa không?</v-card-title
                          >
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="closeDelete"
                              >Không</v-btn
                            >
                            <v-btn
                              color="blue darken-1"
                              text
                              @click="deleteItemConfirm"
                              >Có</v-btn
                            >
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
                      </v-sheet>
                    </v-dialog>
                  </v-toolbar>
                </template>
                <template slot="body.prepend">
                  <tr>
                    <th v-for="item in headers" :key="item.name">
                      <v-text-field
                        v-if="
                          item.filterable &&
                          (item.type == 'String' || item.type == 'int')
                        "
                        v-model="item.dataFilter"
                        :label="item.text"
                        @keyup.enter="onFilterChange(item)"
                      >
                      </v-text-field>

                      <v-autocomplete
                        v-if="item.filterable && item.type === 'boolean'"
                        v-model="item.dataFilter"
                        :items="[
                          { code: 'true', name: 'Có' },
                          { code: 'false', name: 'Không' },
                        ]"
                        :label="item.text"
                        item-text="name"
                        return-object
                        clearable
                        @change="onFilterChange(item)"
                        @click:clear="refreshDatable"
                      ></v-autocomplete>

                      <v-autocomplete
                        v-if="item.filterable && item.type === 'enum'"
                        v-model="item.dataFilter"
                        :items="[
                          { code: 'male', name: 'Nam' },
                          { code: 'female', name: 'Nữ' },
                        ]"
                        :label="item.text"
                        item-text="name"
                        item-value="code"
                        return-object
                        clearable
                        @change="onFilterChange(item)"
                        @click:clear="refreshDatable"
                      ></v-autocomplete>
                      <v-menu
                        v-if="
                          item.filterable &&
                          (item.type == 'Datetime' || item.type == 'Date')
                        "
                        ref="item.menu"
                        v-model="item.menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="item.dataFilter"
                            clearable
                            readonly
                            :label="item.text"
                            v-bind="attrs"
                            v-on="on"
                            @click:clear="refreshDatable"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="item.dataFilter"
                          no-title
                          locale="vi"
                          @click:date="onFilterChange(item)"
                          @input="item.menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </th>
                  </tr>
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-icon
                    v-if="permission.is_edit"
                    small
                    class="mr-2"
                    @click="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    v-if="permission.is_delete"
                    small
                    @click="deletePatient(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>

                <template #no-data>
                  <v-btn color="primary" @click="initialize"> Reset </v-btn>
                </template>
              </v-data-table>
            </client-only>
            <v-tabs background-color="blue" dark no-animation></v-tabs>
          </v-container>
        </v-tab-item>
      </v-tabs>
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
const deletePatientGraphl = gql`
  mutation deletepatients($id: uuid) {
    delete_patients(where: { id: { _eq: $id } }) {
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
    medicines_list: [],
    snackbar: false,
    textSnackbar: '',
    department_types: [],
    hospitals: [],
    // patients.vue
    search: '',
    dialogDelete: false,
    loading: true,
    isFilter: false,
    stringSort: 'created_at: desc',
    filterWhere: '',

    headers: [
      {
        text: 'STT',
        value: 'stt',
        align: 'start',
        sortable: false,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Tên Dược',
        value: 'fullname',
        dataFilter: '',
        type: 'String',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Đơn vị tính',
        value: 'gender',
        type: 'enum',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Số lượng sáng',
        value: 'hospital_code',
        dataFilter: '',
        type: 'String',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Số lượng trưa',
        value: 'id_card_no',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Số lượng chiều',
        value: 'birthday',
        type: 'Date',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Số lượng tối',
        value: 'phone_number',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Tổng số lượng',
        value: 'medical_code',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: '',
        value: 'actions',
        sortable: false,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
    ],

    numberRule: (v) => {
      if (v) {
        if (/^[0-9-/]*$/.test(v)) {
          return true
        } else {
          return 'Không được có khoảng trắng và kí tự'
        }
      }
    },

    patients: [],
    itemsPerPage: 10,
    limit: 10,
    offset: 0,
    editedIndex: -1,
    editedItem: {
      id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: '',
      email: '',
      hospital_code: '',
      id_card_no: '',
      birthday: '',
      phone_number: '',
      medical_code: '',
      passport_no: '',
      address: '',
      note: '',

      patient_infos: [],
      patient_info: [],
      patient_info_date_death: '',
      patient_info_time_death: '',

      patient_hicards: [],
      patient_hicard: [],
      patient_hicards_issued_time: '',
      patient_hicards_date_from: '',
      patient_hicards_date_to: '',
      patient_hicards_time_from: '',
      patient_hicards_time_to: '',

      work_unit_id: 1,
      country_id: 1,
      state_id: 1,
      district_id: 1,
      ward_id: 1,
      ethnic_group_id: 1,
      career_id: 1,
      employee_id: 1,

      // work_unit: { id: null, name: null },
      // country: { id: null, name: null },
      // state: { id: null, name: null },
      // district: { id: null, name: null },
      // ward: { id: null, name: null },
      // ethnic_group: { id: null, name: null },
      // career: { id: null, name: null },
      // employee: { id: null, name: null },

      work_unit: { id: null, name: null },
      country: { id: null, name: null },
      state: { id: null, name: null },
      district: { id: null, name: null },
      ward: { id: null, name: null },
      ethnic_group: { id: null, name: null },
      career: { id: null, name: null },
      employee: { id: null, name: null },
    },
    defaultItem: {
      id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: '',
      email: '',
      hospital_code: '',
      id_card_no: '',
      birthday: '',
      phone_number: '',
      medical_code: '',
      passport_no: '',
      address: '',
      note: '',
      patient_info_date_death: '',
      patient_info_time_death: '',

      patient_infos: [],
      patient_info: [],

      patient_hicards: [],
      patient_hicard: [],

      work_unit_id: 1,
      country_id: 1,
      state_id: 1,
      district_id: 1,
      ward_id: 1,
      ethnic_group_id: 1,
      career_id: 1,
      employee_id: 1,

      work_unit: { id: null, name: null },
      country: { id: null, name: null },
      state: { id: null, name: null },
      district: { id: null, name: null },
      ward: { id: null, name: null },
      ethnic_group: { id: null, name: null },
      career: { id: null, name: null },
      employee: { id: null, name: null },
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
    medicine: {
      id: '',
    },
  }),

  apollo: {
    // patients.vue
    totalData: {
      query() {
        return gql(`query getTotalpatients {
            totalData: patients_aggregate(order_by: { id: desc },${this.filterWhere}) {
                aggregate {
                    count
                }
            }
        }`)
      },
      skip() {
        return !this.patients
      },
    },
    patients: {
      query() {
        // const query = this.model.getQuery('list', {
        //   alias: 'tableData',
        //   limit: this.limit,
        //   offset: this.offset,
        // })
        const queryl = gql`
          query MyQuery {
            patients(order_by:{${this.stringSort}} ${this.filterWhere},limit:${this.limit} , offset: ${this.offset},) {
              fullname
              first_name
              middle_name
              last_name
              plain_name
              gender
              email
              hospital_code
              id
              id_card_no
              birthday
              phone_number
              medical_code
              passport_no
              address
              note
              patient_infos {
                country {
                  id
                  name
                }
                allergy
                anamnesis
                apartment_num
                blood_group_id
                career_id
                cause_of_death_id
                contact_address
                career {
                  id
                  name
                }
                country_id
                death_confirm_staff_id
                death_date
                district {
                  name
                  id
                }
                death_confirm_staff {
                  id
                  fullname
                }
                employee {
                  id
                  fullname
                }
                hashicard
                ethnic_group {
                  id
                  name
                }
                hicard_id
                image_source
                inpatient_number
                isDeath
                isMarried
                is_foreigner
                is_overseas
                ordinal
                outpatient_number
                patient_type
                permanent_address
                plain_name
                rh_factor_id
                smoking_history
                staff_code
                state {
                  id
                  name
                }
                ward {
                  id
                  name
                }
                cause_of_death {
                  id
                  name
                }
                work_address
                work_unit {
                  id
                  name
                }
              }
              patient_hicards {
                hi_datefrom
                hi_dateto
                hi_number
                hi_type
                hicard_issued_date
                hicard_issued_time
                is_active
              }
            }
          }
        `
        for (let index = 0; index < this.patients.length; index++) {
          const element = this.patients[index]
          element.stt = index + 1
          if (element.gender === 'male') {
            element.gender = 'Nam'
          } else if (element.gender === 'female') {
            element.gender = 'Nữ'
          }
        }
        if (
          this.patients.length >= 0 ||
          (this.isFilter && this.patients.length === 0)
        ) {
          this.loading = false
        }
        return queryl
      },
      skip() {
        return !this.patients
      },
    },
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

    medicines_list: {
      query: gql(`query MyQuery {
                    medicine_names{
                      name
                    }
                  }`),
      update: (data) => {},
      result({ data }) {
        this.medicines_list = data.medicines_list
      },
    },

    medicines_: {
      query: gql(`query MyQuery {
                    medicine_names(where: {name: {_eq: ${localStorage.getItem(
                      'name'
                    )}}}) {
                      name
                    }
                  }`),
      update: (data) => {},
      result({ data }) {
        this.medicines_list = data.name
      },
    },

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

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Thêm bệnh nhân'
        : 'Cập nhật thông tin bệnh nhân'
    },
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
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
      this.patients = []
    },
    add() {
      this.$router.push({
        path: `/list/old_core/patient/patient_edit`,
        query: { id: null },
      })
    },
    paginate(vale) {
      if (vale.sortBy.length > 0) {
        let tempSortOrder = 'asc'
        if (vale.sortDesc[0] === true) {
          tempSortOrder = 'desc'
        }
        const tempString = vale.sortBy[0].split('.')
        if (tempString.length > 1) {
          this.stringSort = `${tempString[0]}:{${tempString[1]}: ${tempSortOrder}}`
        } else {
          this.stringSort = `${vale.sortBy[0]}: ${tempSortOrder}`
        }
      }
    },
    editItem(item) {
      this.editedIndex = this.patients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.$router.push({
        path: `/list/old_core/patient/patient_edit`,
        query: { id: `${this.editedItem.id}` },
      })

      // this.editedItem.patient_info = this.editedItem.patient_infos[0]
      // this.editedItem.patient_hicard = this.editedItem.patient_hicards[0]

      // this.dialog = true
    },
    getTotalData() {
      if (this.totalData && this.totalData.aggregate) {
        return this.totalData.aggregate.count
      } else return -1
    },
    onPaginationChange(eventData) {
      if (
        this.limit !== eventData.itemsPerPage ||
        this.offset !== eventData.pageStart
      ) {
        this.limit = eventData.itemsPerPage
        this.offset = eventData.pageStart
        if (this.isFilter) {
          this.refreshQuery()
        } else {
          this.refreshDatable()
        }
      }
    },
    refreshDatable() {
      this.isFilter = false
      this.filterWhere = ''
      this.refreshQuery()
    },
    refreshQuery() {
      this.loading = true
      this.$apollo.queries.patients.refresh()
      this.$apollo.queries.totalData.refresh()
    },
    searchAll() {
      this.filterWhere = 'where: {_or: [ '

      //  reception_time: { _gte: "${date1}", _lt: "${date2}" }}
      // ]'
      let boolCheckFilter = false
      for (let index = 0; index < this.headers.length; index++) {
        const element = this.headers[index]
        if (element.filterable && this.search) {
          boolCheckFilter = true
          if (element.type === 'String') {
            this.filterWhere =
              this.filterWhere +
              `{${element.value}: {_ilike: "%${this.search}%"}}`
          }
          //  else if (element.type === 'int') {
          //   this.filterWhere =
          //     this.filterWhere + `{${element.value}: {_eq: ${this.search}}}`
          // }
          else if (element.type === 'relation') {
            this.filterWhere =
              this.filterWhere + `{${element.queryWhere}${this.search}%"}}}`
          }
          // else if (element.type === 'Datetime') {
          //   const date2 = this.search + ' ' + '23:59:59'
          //   this.filterWhere =
          //     this.filterWhere +
          //     `{${element.value}: {_gte: "${this.search}",_lte: "${date2}"}}`
          // } else if (element.type === 'Date') {
          //   this.filterWhere =
          //     this.filterWhere + `{${element.value}: {_eq: "${this.search}"}}`
          // }
        }
      }
      if (boolCheckFilter) {
        this.filterWhere =
          this.filterWhere +
          `{full_search_1: {_ilike: "%${this.search}%"}}` +
          ']}'

        this.isFilter = true
        this.refreshQuery()
      } else {
        this.refreshDatable()
      }
    },

    onFilterChange(item) {
      if (item.dataFilter) {
        this.filterWhere = 'where:{'
        if (item.type === 'String') {
          this.filterWhere =
            this.filterWhere + `${item.value}: {_like: "%${item.dataFilter}%"}`
        } else if (item.type === 'int') {
          this.filterWhere =
            this.filterWhere + `${item.value}: {_eq: ${item.dataFilter}}`
        } else if (item.type === 'Datetime') {
          const date2 = item.dataFilter + ' ' + '23:59:59'
          this.filterWhere =
            this.filterWhere +
            `${item.value}: {_gte: "${item.dataFilter}",_lte: "${date2}"}`
        } else if (item.type === 'Date') {
          this.filterWhere =
            this.filterWhere + `${item.value}: {_eq: "${item.dataFilter}"}`
        } else if (item.type === 'relation') {
          this.filterWhere =
            this.filterWhere + `${item.queryWhere}${item.dataFilter.name}%"}}`
        } else if (item.type === 'boolean' || item.type === 'enum') {
          this.filterWhere =
            this.filterWhere + `${item.value}: {_eq: ${item.dataFilter.code}}`
        } else if (item.type === 'relationsingle') {
          this.filterWhere =
            this.filterWhere + `${item.queryWhere}${item.dataFilter}%"}}`
        }
        this.filterWhere = this.filterWhere + '}'
        this.isFilter = true
        this.refreshQuery()
      } else {
        this.refreshDatable()
      }
    },
    deletePatient(item) {
      this.editedIndex = this.patients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.idPatient = this.patients[this.editedIndex].id
      this.patients.splice(this.editedIndex, 1)
      this.$apollo.mutate({
        mutation: deletePatientGraphl,
        variables: {
          id: this.idPatient,
        },
        update: (store, { data: { delete_patients } }) => {
          if (delete_patients.affected_rows) {
            // eslint-disable-next-line
            this.textSnackbar = 'Xoá bệnh nhân thành công'
            this.snackbar = true
            this.refreshQuery()
          } else {
            this.textSnackbar = 'Xoá bệnh nhân thất bại'
            this.snackbar = true
          }
        },
      })
      this.closeDelete()
      return 'sucess'
    },

    close() {
      this.dialog = false
      this.dialogPatientDetail = false
      this.dialogPatientHiCard = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
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
