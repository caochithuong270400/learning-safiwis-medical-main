<template>
  <client-only>
    <v-data-table
      :headers="headers"
      :items="medicines"
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
      style="width: 100%"
    >
      <template #[`item.is_pause`]="{ item }">
        <v-simple-checkbox v-model="item.is_pause" disabled></v-simple-checkbox>
      </template>

      <!-- <template #top>
        <v-snackbar v-model="snackbar">
          {{ textSnackbar }}

          <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
        <v-toolbar flat>
          <v-toolbar-title class="blue--text">Thuốc</v-toolbar-title>
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
            Thêm thuốc
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
      </template> -->
      <template slot="body.prepend">
        <tr>
          <th v-for="item in headers" :key="item.name">
            <!-- //search under -->
            <v-text-field
              v-if="
                item.filterable &&
                (item.type == 'String' ||
                  item.type == 'int' ||
                  item.type == 'relationsingle')
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
            <!-- <v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'department_type.name'
              "
              v-model="item.dataFilter"
              :items="department_types"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete>

            <v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'internal_hospital.code'
              "
              v-model="item.dataFilter"
              :items="internal_hospitals"
              :label="item.text"
              item-text="code"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete> -->
            <!-- <v-menu
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
            </v-menu> -->
          </th>
        </tr>
      </template>
      <!-- <template #[`item.actions`]="{ item }">
        <v-icon
          v-if="permission.is_edit"
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon v-if="permission.is_delete" small @click="deleteClinic(item)">
          mdi-delete
        </v-icon>
      </template> -->
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

const deleteClinicGraphl = gql`
  mutation deletemedicines($id: Int) {
    delete_medicines(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

export default {
  name: 'Medicines',
  data: () => ({
    search: '',
    dialogDelete: false,
    snackbar: false,
    textSnackbar: '',
    user: {},
    permission: {},
    loading: true,
    isFilter: false,
    headers: [
      {
        text: 'STT',
        value: 'stt',
        align: 'start',
        sortable: false,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Tên thuốc',
        value: 'medicine_name.name',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      // {
      //   text: 'Phân loại',
      //   value: 'name',
      //   type: 'String',
      //   dataFilter: '',
      //   filterable: true,
      //   sortable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      {
        text: 'Đơn vị',
        value: 'unit',
        type: 'String',
        // width: '160px',
        queryWhere: 'department_type: {name: {_like: "%',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      // {
      //   text: 'Cấp bậc',
      //   value: 'level',
      //   type: 'int',
      //   dataFilter: '',
      //   filterable: true,
      //   sortable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      {
        text: 'Nhà sản xuất',
        value: 'medicine_name.production_company',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },

      // {
      //   text: 'Số lượng trong kho',
      //   value: 'in_service',
      //   type: 'boolean',
      //   width: '160px',
      //   dataFilter: '',
      //   filterable: true,
      //   sortable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      {
        text: 'Tạm ngưng',
        value: 'is_pause',
        type: 'boolean',
        width: '160px',
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
    filterWhere: `where: {  internal_hospital_id: {_eq: ${localStorage.getItem(
      'hospital'
    )}} }`,
    itemsPerPage: 10,
    limit: 10,
    offset: 0,
    medicines: [],
    internal_hospitals: [],
    stringSort: 'created_at: desc',
    department_types: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      code: '',
      departmentTypeId: '',
      level: '',
      superiorId: '',
      manager: '',
      clinic_type_id: '',
      is_pause: true,
      plain_name: '',
      in_service: true,
      idx: '',
      hrm: true,
      costcenter_id: '',

      name_en: '',
      name_ru: '',
    },
    defaultItem: {
      id: '',
      code: '',
      departmentTypeId: '',
      level: '',
      superiorId: '',
      manager: '',
      clinic_type_id: '',
      is_pause: true,
      plain_name: '',
      in_service: true,
      idx: '',
      hrm: true,
      costcenter_id: '',
      name_en: '',
      name_ru: '',
    },
  }),
  apollo: {
    totalData: {
      query() {
        return gql(`query getTotalmedicines {
            totalData: medicines_aggregate(order_by: { created_at: desc },${this.filterWhere}) {
                aggregate {
                    count
                }
            }
        }`)
      },
      skip() {
        return !this.medicines
      },
    },

    medicines: {
      query() {
        // const query = this.model.getQuery('list', {
        //   alias: 'tableData',
        //   limit: this.limit,
        //   offset: this.offset,
        // })
        const queryl = gql`query MyQuery {
                    medicines(order_by: {${this.stringSort}},${this.filterWhere},limit:${this.limit} , offset: ${this.offset},) {
                      calculation_unit_id
                      medicine_name {
                        id
                        name
                        fullname
                        production_company
                      }
                      code
                      unit
                      TT43
                      account_number
                      accounting_code
                      attribute_1
                      attribute_2
                      attribute_3
                      attribute_4
                      code_ven
                      content
                      contract_period
                      contraindications
                      country_id
                      created_at
                      created_by
                      detaile_content
                      diagnostic_drug
                      direction
                      id
                      internal_hospital_id
                      is_hi
                      is_pause
                      is_pause_out
                      is_pause_reserve
                      is_special_interest
                      itc
                      manufacturer_id
                      medicine_classify_id
                      medicine_grouping_id
                      medicine_guide_id
                      medicine_name_id
                      note
                      medicine_type_id
                      number_ttbyt
                      number_tttt
                      pause_date
                      reference_number
                      registered_number
                      updated_at
                      updated_by
                      unit
                      uses
                      vat
                      warning
                    }
                  }
               `
        for (let index = 0; index < this.medicines.length; index++) {
          const element = this.medicines[index]
          element.stt = index + 1 + this.offset
        }
        if (
          this.medicines.length >= 0 ||
          (this.isFilter && this.medicines.length === 0)
        ) {
          this.loading = false
        }
        // console.log('this.medicines', this.medicines)
        return queryl
      },
      skip() {
        return !this.medicines
      },
    },
    listParentDepartments: {
      query: gql(`query MyQuery {
                    internal_hospitals(order_by: {created_at: desc}) {
                      id
                      name
                      code
                    }
                    department_types(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
                      'hospital'
                    )}}}) {
                        id
                        name
                      }
                  }
               `),
      update: (data) => {},
      result({ data }) {
        this.department_types = data.department_types
        this.internal_hospitals = data.internal_hospitals
      },
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Thêm thuốc' : 'Cập nhật thông tin thuốc'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
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
            // console.log('this.permission', response)
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
      this.medicines = []
    },

    add() {
      this.$router.push({
        path: `/list/old_core/medicine/medicine_edit`,
        query: { id: 0 },
      })
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
          else if (
            element.type === 'relation' ||
            element.type === 'relationsingle'
          ) {
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
      // console.log('this.filterWhere', this.filterWhere)
      if (boolCheckFilter) {
        this.filterWhere =
          this.filterWhere +
          `] internal_hospital_id: {_eq: ${localStorage.getItem('hospital')}}}`
        this.isFilter = true
        this.refreshQuery()
      } else {
        this.refreshDatable()
      }
    },
    refreshDatable() {
      this.isFilter = false
      this.filterWhere = `where: {  internal_hospital_id: {_eq: ${localStorage.getItem(
        'hospital'
      )}} }`
      this.refreshQuery()
    },
    refreshQuery() {
      this.loading = true
      this.$apollo.queries.medicines.refresh()
      this.$apollo.queries.totalData.refresh()
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
        // console.log('asdasd')
      }
    },
    onFilterChange(item) {
      console.log(this.medicines)
      // console.log('item', item.value)
      // if (item.dataFilter) {
      //   this.filterWhere = 'where:{'
      //   if (item.type === 'String') {
      //     this.filterWhere =
      //       this.filterWhere + `${item.value}: {_like: "%${item.dataFilter}%"}`
      //   } else if (item.type === 'int') {
      //     this.filterWhere =
      //       this.filterWhere + `${item.value}: {_eq: ${item.dataFilter}}`
      //   } else if (item.type === 'Datetime') {
      //     const date2 = item.dataFilter + ' ' + '23:59:59'
      //     this.filterWhere =
      //       this.filterWhere +
      //       `${item.value}: {_gte: "${item.dataFilter}",_lte: "${date2}"}`
      //   } else if (item.type === 'Date') {
      //     this.filterWhere =
      //       this.filterWhere + `${item.value}: {_eq: "${item.dataFilter}"}`
      //   } else if (item.type === 'relation') {
      //     this.filterWhere =
      //       this.filterWhere + `${item.queryWhere}${item.dataFilter.name}%"}}`
      //   } else if (item.type === 'boolean' || item.type === 'enum') {
      //     this.filterWhere =
      //       this.filterWhere + `${item.value}: {_eq: ${item.dataFilter.code}}`
      //   } else if (item.type === 'relationsingle') {
      //     this.filterWhere =
      //       this.filterWhere + `${item.queryWhere}${item.dataFilter}%"}}`
      //   }
      //   this.filterWhere =
      //     this.filterWhere +
      //     `, internal_hospital_id: {_eq: ${localStorage.getItem('hospital')}}}`
      //   this.isFilter = true
      //   this.refreshQuery()
      // } else {
      //   this.refreshDatable()
      // }
    },
    editItem(item) {
      this.editedIndex = this.medicines.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.$router.push({
        path: `/list/old_core/medicine/medicine_edit`,
        query: { id: this.editedItem.id },
      })
    },

    deleteClinic(item) {
      this.editedIndex = this.medicines.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.idClinic = this.medicines[this.editedIndex].id
      this.medicines.splice(this.editedIndex, 1)
      this.$apollo.mutate({
        mutation: deleteClinicGraphl,
        variables: {
          id: this.idClinic,
        },
        update: (store, { data: { delete_medicines } }) => {
          if (delete_medicines.affected_rows) {
            // console.log('xóa thuốc')
            // eslint-disable-next-line
            this.textSnackbar = 'Xóa thuốc thành công'
            this.snackbar = true
            this.refreshQuery()
          } else {
            this.textSnackbar = 'Xóa thuốc thất bại'
            this.snackbar = true
          }
        },
      })
      this.closeDelete()
      return 'sucess'
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
