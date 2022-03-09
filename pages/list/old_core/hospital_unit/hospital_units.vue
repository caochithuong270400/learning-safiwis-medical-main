<template>
  <client-only>
    <v-container fluid style="margin: 0px; padding: 0px; width: 100%">
      <v-data-table
        :headers="headers"
        :items="hospital_units"
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
        <template #[`item.is_pause`]="{ item }">
          <v-simple-checkbox
            v-model="item.is_pause"
            disabled
          ></v-simple-checkbox>
        </template>
        <template #[`item.in_service`]="{ item }">
          <v-simple-checkbox
            v-model="item.in_service"
            disabled
          ></v-simple-checkbox>
        </template>
        <template #[`item.hrm`]="{ item }">
          <v-simple-checkbox v-model="item.hrm" disabled></v-simple-checkbox>
        </template>
        <template slot="body.prepend">
          <tr>
            <th v-for="item in headers" :key="item.name">
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
                v-if="
                  item.filterable &&
                  item.type === 'relation' &&
                  item.value == 'internal_hospital.name'
                "
                v-model="item.dataFilter"
                :items="internal_hospitals"
                :label="item.text"
                item-text="name"
                item-value="id"
                return-object
                clearable
                @change="onFilterChange(item)"
                @click:clear="refreshDatable"
              ></v-autocomplete>
            </th>
          </tr>
        </template>
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
            <v-toolbar-title class="blue--text"
              >đơn vị bệnh viện</v-toolbar-title
            >
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
              Thêm đơn vị bệnh viện
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
            @click="deletehospital_unit(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template #no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </client-only>
</template>

<script>
/* eslint-disable camelcase */
import firebase from 'firebase'
import gql from 'graphql-tag'
// import Datatable from '~/components/core/Datatable'

const deletehospital_unitGraphl = gql`
  mutation deletehospital_units($id: Int) {
    delete_hospital_units(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

export default {
  data: () => ({
    itemsPerPage: 10,
    limit: 10,
    offset: 0,
    search: '',
    dialogDelete: false,
    user: {},
    permission: {},
    loading: true,
    isFilter: false,
    snackbar: false,
    textSnackbar: '',
    filterWhere: `where: {  internal_hospital_id: {_eq: ${localStorage.getItem(
      'hospital'
    )}} }`,
    stringSort: 'created_at: desc',
    internal_hospitals: [],
    headers: [
      {
        text: 'STT',
        value: 'stt',
        align: 'start',
        sortable: false,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Mã đơn vị bệnh viện',
        value: 'code',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },

      {
        text: 'Tên đơn vị bệnh viện',
        value: 'name',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      // {
      //   text: 'Bệnh viện',
      //   value: 'internal_hospital.name',
      //   type: 'relation',
      //   width: '160px',
      //   queryWhere: 'internal_hospital: {name: {_like: "%',
      //   dataFilter: '',
      //   filterable: true,
      //   sortable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      {
        text: '',
        value: 'actions',
        sortable: false,
        filterable: false,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
    ],

    hospital_units: [],
    editedIndex: -1,
  }),

  apollo: {
    hospital_units: {
      query() {
        // const query = this.model.getQuery('list', {
        //   alias: 'tableData',
        //   limit: this.limit,
        //   offset: this.offset,
        // })
        const queryl = gql`query MyQuery {
                    hospital_units(order_by: {${this.stringSort}},${this.filterWhere},limit:${this.limit} , offset: ${this.offset},) {
                     id
                     code
                     name
                     internal_hospital{
                       id
                       name
                     }
                  }}
               `

        for (let index = 0; index < this.hospital_units.length; index++) {
          const element = this.hospital_units[index]
          element.stt = index + 1 + this.offset
        }
        if (
          this.hospital_units.length >= 0 ||
          (this.isFilter && this.hospital_units.length === 0)
        ) {
          this.loading = false
        }
        return queryl
      },
      skip() {
        return !this.hospital_units
      },
    },
    totalData: {
      query() {
        return gql(`query getTotalhospital_units {
            totalData: hospital_units_aggregate(order_by: { created_at: desc },${this.filterWhere}) {
                aggregate {
                    count
                }
            }
        }`)
      },
      skip() {
        return !this.hospital_units
      },
    },
    listParenthospital_units: {
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
      },
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Thêm đơn vị bệnh viện'
        : 'Cập nhật thông tin đơn vị bệnh viện'
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
      this.hospital_units = []
      this.filterWhere = `where: {internal_hospital_id: {_eq: ${localStorage.getItem(
        'hospital'
      )}}}`
    },

    add() {
      this.$router.push({
        path: `/list/old_core/hospital_unit/hospital_unit_edit`,
        query: { id: 0 },
      })
    },
    editItem(item) {
      this.editedIndex = this.hospital_units.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.$router.push({
        path: `/list/old_core/hospital_unit/hospital_unit_edit`,
        query: { id: this.editedItem.id },
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
      if (boolCheckFilter) {
        this.filterWhere =
          this.filterWhere +
          `], internal_hospital_id: {_eq: ${localStorage.getItem('hospital')}}}`
        this.isFilter = true
        this.refreshQuery()
      } else {
        this.refreshDatable()
      }
    },
    refreshDatable() {
      this.isFilter = false
      this.filterWhere = `where: {internal_hospital_id: {_eq: ${localStorage.getItem(
        'hospital'
      )}}}`
      this.refreshQuery()
    },
    refreshQuery() {
      this.loading = true
      this.$apollo.queries.hospital_units.refresh()
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
    onFilterChange(item) {
      console.log('item', item)
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
        this.filterWhere =
          this.filterWhere +
          `, internal_hospital_id: {_eq: ${localStorage.getItem('hospital')}}}`
        this.isFilter = true
        this.refreshQuery()
      } else {
        this.refreshDatable()
      }
    },
    deletehospital_unit(item) {
      this.editedIndex = this.hospital_units.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
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
    deleteItemConfirm() {
      this.idhospital_unit = this.hospital_units[this.editedIndex].id
      this.hospital_units.splice(this.editedIndex, 1)
      this.$apollo.mutate({
        mutation: deletehospital_unitGraphl,
        variables: {
          id: this.idhospital_unit,
        },
        update: (store, { data: { delete_hospital_units } }) => {
          if (delete_hospital_units.affected_rows) {
            console.log('xóa đơn vị bệnh viện')
            // eslint-disable-next-line
            this.textSnackbar = 'Xóa đơn vị bệnh viện thành công'
            this.snackbar = true
            this.refreshQuery()
          } else {
            this.textSnackbar = 'Xóa đơn vị bệnh viện thất bại'
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
