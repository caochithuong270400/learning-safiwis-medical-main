<template>
  <client-only>
    <v-data-table
      :headers="headers"
      :items="employees"
      :server-items-length="getTotalData()"
      :items-per-page="itemsPerPage"
      :footer-props="{
        itemsPerPageText: 'số dòng mỗi trang',
        pageText: '{0}-{1} trên {2}',
      }"
      item-key="id"
      single-expand
      :expanded.sync="expanded"
      show-expand
      class="elevation-1"
      :loading="loading"
      loading-text="Đang tải...vui lòng đợi"
      @pagination="onPaginationChange"
      @update:options="paginate"
    >
      <template #[`item.is_direct_product`]="{ item }">
        <v-simple-checkbox
          v-model="item.is_direct_product"
          disabled
        ></v-simple-checkbox>
      </template>
      <template #[`item.is_toxic_exposure`]="{ item }">
        <v-simple-checkbox
          v-model="item.is_toxic_exposure"
          disabled
        ></v-simple-checkbox>
      </template>
      <template #[`item.is_pause`]="{ item }">
        <v-simple-checkbox v-model="item.is_pause" disabled></v-simple-checkbox>
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
          <v-toolbar-title class="blue--text">Bác sĩ</v-toolbar-title>
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
            Thêm bác sĩ
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
          <th></th>
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
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'career.name'
              "
              v-model="item.dataFilter"
              :items="careers"
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
                item.value == 'department.name'
              "
              v-model="item.dataFilter"
              :items="departments"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'work_unit.name'
              "
              v-model="item.dataFilter"
              :items="work_units"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'title.name'
              "
              v-model="item.dataFilter"
              :items="titles"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'position.name'
              "
              v-model="item.dataFilter"
              :items="positions"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'qualification.name'
              "
              v-model="item.dataFilter"
              :items="qualifications"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
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
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'country.name'
              "
              v-model="item.dataFilter"
              :items="countries"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'state.name'
              "
              v-model="item.dataFilter"
              :items="states"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'district.name'
              "
              v-model="item.dataFilter"
              :items="districts"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'ward.name'
              "
              v-model="item.dataFilter"
              :items="wards"
              :label="item.text"
              item-text="name"
              item-value="id"
              return-object
              clearable
              @change="onFilterChange(item)"
              @click:clear="refreshDatable"
            ></v-autocomplete
            ><v-autocomplete
              v-if="
                item.filterable &&
                item.type === 'relation' &&
                item.value == 'ethnic_group.name'
              "
              v-model="item.dataFilter"
              :items="ethnic_groups"
              :label="item.text"
              item-text="name"
              item-value="id"
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
      <template #expanded-item="{ headers, item }">
        <td v-if="item.service_doctors.length > 0" :colspan="headers.length">
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr
                  v-for="service_doctor in item.service_doctors"
                  :key="service_doctor.id"
                >
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Dịch vụ:</td>
                  <td>{{ service_doctor.service.name }}</td>
                  <td>Tạm ngừng:</td>
                  <td>
                    <v-simple-checkbox
                      v-model="service_doctor.is_pause"
                      disabled
                    ></v-simple-checkbox>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </td>
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
        <v-icon v-if="permission.is_delete" small @click="deleteemployee(item)">
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

const deleteemployeeGraphl = gql`
  mutation deleteemployees($id: Int) {
    delete_employees(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

export default {
  data: () => ({
    loading: true,
    itemsPerPage: 10,
    limit: 10,
    offset: 0,
    user: {},
    permission: {},
    expanded: [],
    search: '',
    dialogDelete: false,
    snackbar: false,
    textSnackbar: '',
    departments: [],
    work_units: [],
    titles: [],
    positions: [],
    qualifications: [],
    countries: [],
    states: [],
    districts: [],
    wards: [],
    stringSort: 'created_at: desc',
    ethnic_groups: [],
    careers: [],
    filterWhere: `where: { type: { _eq: "BS" }, internal_hospital_id: {_eq: ${localStorage.getItem(
      'hospital'
    )}} }`,
    headers: [
      {
        text: 'STT',
        value: 'stt',
        align: 'start',
        sortable: false,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Mã',
        value: 'code',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Họ',
        value: 'last_name',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Tên đệm',
        value: 'middle_name',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Tên',
        value: 'first_name',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Họ tên đầy đủ',
        value: 'fullname',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      // {
      //   text: 'Tên tắt',
      //   value: 'short_name',
      //   type: 'String',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      {
        text: 'Họ tên không dấu',
        value: 'plain_name',
        type: 'String',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      // {
      //   text: 'Ngày sinh',
      //   value: 'birthday',
      //   type: 'Date',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
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
      // {
      //   text: 'Địa chỉ',
      //   value: 'address',
      //   type: 'String',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      {
        text: 'Phòng ban',
        value: 'department.name',
        type: 'relation',
        width: '160px',
        queryWhere: 'department: {name: {_like: "%',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Chức danh',
        value: 'title.name',
        type: 'relation',
        width: '160px',
        queryWhere: 'title: {name: {_like: "%',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Chức vụ',
        value: 'position.name',
        type: 'relation',
        width: '160px',
        queryWhere: 'position: {name: {_like: "%',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      // {
      //   text: 'Trình độ chuyên môn',
      //   value: 'qualification.name',
      //   type: 'relation',
      //   width: '160px',
      //   queryWhere: 'qualification: {name: {_like: "%',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      {
        text: 'Quốc tịch',
        value: 'country.name',
        type: 'relation',
        width: '160px',
        queryWhere: 'country: {name: {_like: "%',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      // {
      //   text: 'Thành phố',
      //   value: 'state.name',
      //   type: 'relation',
      //   width: '160px',
      //   queryWhere: 'state: {name: {_like: "%',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      // {
      //   text: 'Huyện',
      //   value: 'district.name',
      //   type: 'relation',
      //   width: '160px',
      //   queryWhere: 'district: {name: {_like: "%',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      // {
      //   text: 'Quận',
      //   value: 'ward.name',
      //   type: 'relation',
      //   width: '160px',
      //   queryWhere: 'district: {name: {_like: "%',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      // {
      //   text: 'Dân tộc',
      //   value: 'ethnic_group.name',
      //   type: 'relation',
      //   width: '160px',
      //   queryWhere: 'ethnic_group: {name: {_like: "%',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      // {
      //   text: 'Nghề nghiệp',
      //   value: 'career.name',
      //   type: 'relation',
      //   width: '160px',
      //   queryWhere: 'career: {name: {_like: "%',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      // {
      //   text: 'CMND/Passport',
      //   value: 'id_card_no',
      //   type: 'String',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      // { text: 'Passport', value: 'passport_no' , class: 'blue lighten-2 font-weight-medium text-h4 white--text',},
      {
        text: 'Trực tiếp sản xuất',
        value: 'is_direct_product',
        type: 'boolean',
        width: '160px',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: 'Tiếp xúc độc hại',
        value: 'is_toxic_exposure',
        type: 'boolean',
        width: '160px',
        dataFilter: '',
        filterable: true,
        sortable: true,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
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
      // {
      //   text: 'Mã đơn vị',
      //   value: 'unit_code',
      //   type: 'String',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      // {
      //   text: 'Ngày vào',
      //   value: 'day_in',
      //   type: 'Date',
      //   dataFilter: '',
      //   filterable: true,
      //   class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      // },
      {
        text: 'mã nhân viên NSTL',
        value: 'code_nstl',
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
    employees: [],
    isFilter: false,
    editedIndex: -1,
    editedItem: {
      id: 1,
      code: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      short_name: '',
      plain_name: '',
      fullname: '',
      birthday: '',
      gender: '',
      address: '',

      department_id: 1,
      work_unit_id: 1,
      title_id: 1,
      position_id: 1,
      qualification_id: 1,
      country_id: 1,
      state_id: 1,
      district_id: 1,
      ward_id: 1,
      ethnic_group_id: 1,
      career_id: 1,

      department: { id: null, name: null },
      work_unit: { id: null, name: null },
      title: { id: null, name: null },
      position: { id: null, name: null },
      qualification: { id: null, name: null },
      country: { id: null, name: null },
      state: { id: null, name: null },
      district: { id: null, name: null },
      ward: { id: null, name: null },
      ethnic_group: { id: null, name: null },
      career: { id: null, name: null },

      id_card_no: '',
      passport_no: '',
      is_direct_product: false,
      is_toxic_exposure: false,
      is_pause: false,
      unit_code: '',
      day_in: '',
      code_nstl: '',
    },
    defaultItem: {
      id: '',
      code: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      short_name: '',
      plain_name: '',
      fullname: '',
      birthday: '',
      gender: '',
      address: '',

      department_id: 1,
      work_unit_id: 1,
      title_id: 1,
      position_id: 1,
      qualification_id: 1,
      country_id: 1,
      state_id: 1,
      district_id: 1,
      ward_id: 1,
      ethnic_group_id: 1,
      career_id: 1,

      department: { id: null, name: null },
      work_unit: { id: null, name: null },
      title: { id: null, name: null },
      position: { id: null, name: null },
      qualification: { id: null, name: null },
      country: { id: null, name: null },
      state: { id: null, name: null },
      district: { id: null, name: null },
      ward: { id: null, name: null },
      ethnic_group: { id: null, name: null },
      career: { id: null, name: null },

      // department_id: { id: null, name: null },
      // work_unit_id: { id: null, name: null },
      // title_id: { id: null, name: null },
      // position_id: { id: null, name: null },
      // qualification_id: { id: null, name: null },
      // country_id: { id: null, name: null },
      // state_id: { id: null, name: null },
      // district_id: { id: null, name: null },
      // ward_id: { id: null, name: null },
      // ethnic_group_id: { id: null, name: null },
      // career_id: { id: null, name: null },

      // departments: [],
      // department: [],
      // work_units: [],
      // work_unit: [],
      // titles: [],
      // title: [],
      // positions: [],
      // position: [],
      // qualifications: [],
      // qualification: [],
      // countrys: [],
      // country: [],
      // states: [],
      // state: [],
      // districts: [],
      // district: [],
      // wards: [],
      // ward: [],
      // ethnic_groups: [],
      // ethnic_group: [],
      // careers: [],
      // career: [],

      id_card_no: '',
      passport_no: '',
      is_direct_product: false,
      is_toxic_exposure: false,
      is_pause: false,
      unit_code: '',
      day_in: '',
      code_nstl: '',
    },
  }),
  apollo: {
    totalData: {
      query() {
        return gql(`query getTotalemployees {
            totalData: employees_aggregate(${this.filterWhere}) {
                aggregate {
                    count
                }
            }
        }`)
      },
      skip() {
        return !this.employees
      },
    },
    employees: {
      query() {
        // const query = this.model.getQuery('list', {
        //   alias: 'tableData',
        //   limit: this.limit,
        //   offset: this.offset,
        // })
        const queryl = gql`
          query MyQuery {
            employees(
              order_by: {${this.stringSort}}
              ${this.filterWhere},limit:${this.limit} , offset: ${this.offset},
            ) {
              work_unit_id
              ward_id
              unit_code
              title_id
              state_id
              short_name
              qualification_id
              position_id
              plain_name
              passport_no
              middle_name
              last_name
              is_toxic_exposure
              is_pause
              is_direct_product
              id_card_no
              id
              gender
              fullname
              first_name
              ethnic_group_id
              district_id
              department_id
              day_in
              country_id
              code_nstl
              code
              career_id
              birthday
              address
              career {
                name
                id
              }
              country {
                name
                id
              }
              department {
                id
                name
              }
              district {
                id
                name
              }
              ethnic_group {
                name
                id
              }
              position {
                name
                id
              }
              qualification {
                name
                id
              }
              state {
                id
                name
              }
              title {
                name
                id
              }
              ward {
                name
                id
              }
              work_unit {
                id
                name
              }
              service_doctors(order_by: { updated_at: desc }) {
                id
                service_id
                service {
                  id
                  name
                }
                doctor_id
                doctor {
                  id
                  fullname
                }
                is_pause
              }
            }
          }
        `
        for (let index = 0; index < this.employees.length; index++) {
          const element = this.employees[index]
          element.stt = index + 1
          if (element.gender === 'male') {
            element.gender = 'Nam'
          } else if (element.gender === 'female') {
            element.gender = 'Nữ'
          }
        }
        if (
          this.employees.length >= 0 ||
          (this.isFilter && this.employees.length === 0)
        ) {
          this.loading = false
        }
        return queryl
      },
      skip() {
        return !this.employees
      },
    },
    carees: {
      query: gql(`query MyQuery {
        departments(order_by: {updated_at: desc}, where: {is_pause: {_eq: false} ,internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
        careers(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
        work_units(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
        titles(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}){
              id
              name
            }
        positions(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}){
              id
              name
            }
        qualifications(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}){
              id
              name
            }
        countries(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}){
              id
              name
            }
        states(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}){
              id
              name
            }
        districts(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}){
              id
              name
            }
        wards(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}){
              id
              name
            }
        ethnic_groups(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}){
              id
              name
            }
      }`),
      update: (data) => {},
      result({ data }) {
        this.careers = data.careers
        this.departments = data.departments
        this.work_units = data.work_units
        this.titles = data.titles
        this.positions = data.positions
        this.qualifications = data.qualifications
        this.countries = data.countries
        this.states = data.states
        this.districts = data.districts
        this.wards = data.wards
        this.ethnic_groups = data.ethnic_groups
      },
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Thêm bác sĩ'
        : 'Cập nhật thông tin bác sĩ'
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
              permission_group_details(where: {permission: {code: {_eq: "doctors"}}}){
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
      this.employees = []
    },
    add() {
      this.$router.push({
        path: `/list/old_core/employee/doctor_edit`,
        query: { id: 0 },
      })
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
          `],type: { _eq: "BS" }, internal_hospital_id: {_eq: ${localStorage.getItem(
            'hospital'
          )}}}`
        this.isFilter = true
        this.refreshQuery()
      } else {
        this.refreshDatable()
      }
    },
    refreshDatable() {
      this.isFilter = false
      this.filterWhere = `where: { type: { _eq: "BS" }, internal_hospital_id: {_eq: ${localStorage.getItem(
        'hospital'
      )}} }`
      this.refreshQuery()
    },
    refreshQuery() {
      this.loading = true
      this.$apollo.queries.employees.refresh()
      this.$apollo.queries.totalData.refresh()
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
          `,type: { _eq: "BS" }, internal_hospital_id: {_eq: ${localStorage.getItem(
            'hospital'
          )}}}`
        this.isFilter = true
        this.refreshQuery()
      } else {
        this.refreshDatable()
      }
    },
    editItem(item) {
      this.editedIndex = this.employees.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.$router.push({
        path: `/list/old_core/employee/doctor_edit`,
        query: { id: this.editedItem.id },
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
        console.log('asdasd')
      }
    },
    deleteemployee(item) {
      this.editedIndex = this.employees.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      console.log(this.editedIndex)
      console.log(this.employees[this.editedIndex].id)
      this.idemployee = this.employees[this.editedIndex].id
      this.employees.splice(this.editedIndex, 1)
      this.$apollo.mutate({
        mutation: deleteemployeeGraphl,
        variables: {
          id: this.idemployee,
        },
        update: (store, { data: { delete_employees } }) => {
          if (delete_employees.affected_rows) {
            // eslint-disable-next-line
            this.textSnackbar = 'Đã xóa bác sĩ thành công'
            this.snackbar = true
            this.refreshQuery()
          } else {
            this.textSnackbar = 'Xóa bác sĩ thất bại'
            this.snackbar = true

            console.log('fail delete')
          }
        },
      })
      this.closeDelete()
      return 'sucess'
    },

    close() {
      this.dialog = false
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
