<template>
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
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
        <v-toolbar flat>
          <v-toolbar-title class="blue--text">Bệnh nhân</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Tìm"
            single-line
            hide-details
            @keyup.enter="searchAll"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn
            v-if="permission.is_add"
            outlined
            color="blue"
            class="mb-2"
            @click="add()"
          >
            Thêm bệnh nhân
          </v-btn>

          <v-dialog v-model="dialogDelete" width="unset">
            <v-sheet outlined color="blue" rounded>
              <v-card>
                <v-card-title class="headline blue--text"
                  >Bạn có chắc xóa không?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Không</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
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
                item.filterable && (item.type == 'String' || item.type == 'int')
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
        <v-icon v-if="permission.is_delete" small @click="deletePatient(item)">
          mdi-delete
        </v-icon>
      </template>

      <template #no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </client-only>
</template>

<script>
/* eslint-disable camelcase */
import gql from 'graphql-tag'
import firebase from 'firebase'
// import Datatable from '~/components/core/Datatable'

const deletePatientGraphl = gql`
  mutation deletepatients($id: uuid) {
    delete_patients(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

export default {
  data: () => ({
    search: '',
    dialogDelete: false,
    loading: true,
    isFilter: false,
    snackbar: false,
    textSnackbar: '',
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
        text: 'Họ Tên',
        value: 'fullname',
        dataFilter: '',
        type: 'String',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Giới tính',
        value: 'gender',
        type: 'enum',
        width: '150px',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Email',
        value: 'email',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Mã bệnh viện',
        value: 'hospital_code',
        dataFilter: '',
        type: 'String',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'CMND/Passport',
        value: 'id_card_no',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Ngày sinh',
        value: 'birthday',
        type: 'Date',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Số ĐT',
        value: 'phone_number',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Mã y tế',
        value: 'medical_code',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      // { text: 'Mã passport', value: 'passport_no' ,class: 'blue lighten-2 font-weight-medium text-h4 white--text',},
      // { text: 'Địa chỉ', value: 'address' , class: 'blue lighten-2 font-weight-medium text-h4 white--text',},
      {
        text: 'Ghi chú',
        value: 'note',
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

      /* Thông tin chi tiết bệnh nhân */
      // {
      //   text: 'Số nhà',
      //   value: 'patient_infos.apartment_num',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Tên không dấu',
      //   value: 'patient_infos.plain_name',
      //   align: ' d-none',
      // },
      // { text: 'Dân tộc', value: 'patient_infos.country_id', align: ' d-none' ,class: 'blue lighten-2 font-weight-medium text-h4 white--text',},
      // { text: 'Thành phố', value: 'patient_infos.state_id', align: ' d-none' ,class: 'blue lighten-2 font-weight-medium text-h4 white--text',},
      // { text: 'Huyện', value: 'patient_infos.district_id', align: ' d-none' ,class: 'blue lighten-2 font-weight-medium text-h4 white--text',},
      // { text: 'Quận', value: 'patient_infos.ward_id', align: ' d-none' },
      // {
      //   text: 'Quốc tịch',
      //   value: 'patient_infos.ethnic_group_id',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Nghề nghiệp',
      //   value: 'patient_infos.career_id',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Nhóm máu',
      //   value: 'patient_infos.blood_group_id',
      //   align: ' d-none',
      // },
      // { text: 'Yếu tố Rh', value: 'patient_infos.rh_factor_id', align: ' d-none' },
      // {
      //   text: 'Số lưu trữ ngoại trú',
      //   value: 'patient_infos.outpatient_number',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Số lưu trữ nội trú',
      //   value: 'patient_infos.inpatient_number',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Việt kiều',
      //   value: 'patient_infos.is_overseas',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Người nước ngoài',
      //   value: 'patient_infos.is_foreigner',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Có thẻ y tế',
      //   value: 'patient_infos.hasHicard',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Mã thẻ y tế',
      //   value: 'patient_infos.Hicard_id',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Mã nhân viên',
      //   value: 'patient_infos.employee_id',
      //   align: ' d-none',
      // },
      // { text: 'Bệnh sử', value: 'patient_infos.anamnesis', align: ' d-none' },
      // {
      //   text: 'Tiền sử hút thuốc lá',
      //   value: 'patient_infos.smoking_history',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Đơn vị công tác',
      //   value: 'patient_infos.work_unit_id',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Địa chỉ thường trú',
      //   value: 'patient_infos.permanent_address',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Địa chỉ liên lạc',
      //   value: 'patient_infos.contact_address',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Địa chỉ thường trú',
      //   value: 'patient_infos.permanent_address',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Địa chỉ cơ quan',
      //   value: 'patient_infos.work_address',
      //   align: ' d-none',
      // },
      // { text: 'Tử vong', value: 'patient_infos.isDeath', align: ' d-none' },
      // {
      //   text: 'Thời gian tử vong',
      //   value: 'patient_infos.death_date',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Nguyên nhân tử vong',
      //   value: 'patient_infos.cause_of_death_id',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Người ghi nhân tử vong',
      //   value: 'patient_infos.death_confirm_staff_id',
      //   align: ' d-none',
      // },
      // { text: 'STT', value: 'patient_infos.ordinal', align: ' d-none' },
      // {
      //   text: 'Lập gia đình',
      //   value: 'patient_infos.isMarried',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Hình ảnh',
      //   value: 'patient_infos.image_source',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Loại bệnh nhân',
      //   value: 'patient_infos.patient_type',
      //   align: ' d-none',
      // },
      // {
      //   text: 'Mã nhân viên',
      //   value: 'patient_infos.staff_code',
      //   align: ' d-none',
      // },
    ],
    patients: [],
    itemsPerPage: 10,
    limit: 10,
    user: {},
    permission: {},
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
  }),
  apollo: {
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
              permission_group_details(where: {permission: {code: {_eq: "patients"}}}){
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
              if (!this.permission.is_view) {
                this.$toast.error(
                  `Tài khoản không có quyền truy cập trang này`,
                  {
                    duration: 2000,
                    position: 'top-center',
                  }
                )
                setTimeout(
                  () =>
                    this.$router.push({
                      path: `/dashboard`,
                    }),
                  1500
                )
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
  },
}
</script>
