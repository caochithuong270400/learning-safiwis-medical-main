<template>
  <v-form id="edit-form" ref="form" v-model="valid" lazy-validation>
    <v-toolbar flat>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="backToList()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Quay lại danh sách Bác sĩ </span>
      </v-tooltip>

      <v-toolbar-title v-if="isEdit" class="blue--text font-weight-bold">{{
        `Chỉnh sửa bác sĩ: ${title_name}`
      }}</v-toolbar-title>
      <v-toolbar-title v-if="!isEdit" class="blue--text font-weight-bold">{{
        `Thêm bác sĩ `
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
    <v-card outlined>
      <v-row class="px-3">
        <v-tabs background-color="blue" dark no-animation>
          <v-tab>thông tin bác sĩ</v-tab>
          <v-tab>dịch vụ thực hiện được</v-tab>
          <v-tab-item
            v-for="n in 2"
            :key="n"
            :transition="false"
            :reverse-transition="false"
          >
            <v-container fluid style="background-color: white">
              <v-row v-if="n == 1" style="background-color: white">
                <v-col cols="12" sm="12" lg="12" xl="12" md="12">
                  <p class="text-decoration-none font-weight-medium blue--text">
                    THÔNG TIN HÀNH CHÍNH
                  </p>
                </v-col>
                <v-col cols="12" sm="4" lg="4" xl="4" md="4">
                  <v-text-field
                    v-model="employee.code"
                    outlined
                    dense
                    label="Mã bác sĩ"
                    class="required"
                    color="red"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" lg="4" xl="4" md="4">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="100"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateFormatted"
                        outlined
                        dense
                        label="Ngày Sinh"
                        maxlength="10"
                        hint="Ngày-Tháng-Năm (vd: 15-02-1999)"
                        class="required"
                        color="red"
                        @blur="
                          employee.birthday = parseDate(
                            dateFormatted,
                            'birthday'
                          )
                        "
                      >
                        <template #append-outer>
                          <v-btn
                            class="mt-n2"
                            elevation="1"
                            fab
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-calendar-month-outline</v-icon>
                          </v-btn>
                        </template></v-text-field
                      >
                    </template>
                    <v-date-picker
                      v-model="employee.birthday"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                  <v-autocomplete
                    v-model="employee.enum_gender"
                    label="Giới tính"
                    :items="genderList"
                    item-text="name"
                    item-value="code"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="employee.last_name"
                    outlined
                    dense
                    label="Họ"
                    class="required"
                    color="red"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="employee.middle_name"
                    outlined
                    dense
                    label="Tên đệm"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="employee.first_name"
                    outlined
                    dense
                    label="Tên"
                    class="required"
                    color="red"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="employee.short_name"
                    outlined
                    dense
                    label="Tên tắt"
                  ></v-text-field>
                </v-col>

                <!-- <v-col cols="12" style="margin-top: -20px" sm="4"
                  lg="4"
                  xl="4"
                  md="4">
            <v-text-field
              v-model="employee.plain_name"
              outlined
              dense
              label="Tên không dấu"
            ></v-text-field>
          </v-col> -->
                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="employee.id_card_no"
                    outlined
                    dense
                    label="CMND/Passport"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.ethnic_group"
                    label="Dân tộc"
                    :items="ethnic_groups"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                    clearable
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  sm="12"
                  lg="12"
                  xl="12"
                  md="12"
                  style="margin-top: -35px"
                >
                  <v-divider class="py-1"></v-divider>
                  <p class="text-decoration-none font-weight-medium blue--text">
                    THÔNG TIN LIÊN LẠC
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.country"
                    label="Quốc tịch"
                    :items="countries"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="8"
                  lg="8"
                  xl="8"
                  md="8"
                >
                  <v-text-field
                    v-model="employee.address"
                    outlined
                    dense
                    label="Địa chỉ"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.state"
                    label="Thành phố"
                    :items="states"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.district"
                    label="Quận/Huyện"
                    :items="districts"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.ward"
                    label="Phường/Xã"
                    :items="wards"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  lg="12"
                  xl="12"
                  md="12"
                  style="margin-top: -35px"
                >
                  <v-divider class="py-1"></v-divider>
                  <p class="text-decoration-none font-weight-medium blue--text">
                    THÔNG TIN CÔNG VIỆC
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.department"
                    label="Phòng ban"
                    :items="departments"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.work_unit"
                    label="Đơn vị công tác"
                    :items="workUnits"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.title"
                    label="Chức danh"
                    :items="titles"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.position"
                    label="Chức vụ"
                    :items="positions"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.qualification"
                    label="Trình độ chuyên môn"
                    :items="qualifications"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                    clearable
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-autocomplete
                    v-model="employee.career"
                    label="Nghề nghiệp"
                    :items="careers"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
                    clearable
                  ></v-autocomplete>
                </v-col>

                <!-- <v-col
            cols="12"
            style="margin-top: -20px"
            sm="4"
            lg="4"
            xl="4"
            md="4"
          >
            <v-text-field
              v-model="employee.passport_no"
              outlined
              dense
              label="Passport"
            ></v-text-field>
          </v-col> -->

                <!-- <v-col
            cols="12"
            style="margin-top: -20px"
            sm="4"
            lg="4"
            xl="4"
            md="4"
          >
            <v-text-field
              v-model="employee.unit_code"
              outlined
              dense
              label="mã đơn vị"
            ></v-text-field>
          </v-col>

          <v-col
            cols="12"
            style="margin-top: -20px"
            sm="4"
            lg="4"
            xl="4"
            md="4"
          >
            <v-menu
              v-model="menuDayin"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="employee.day_in"
                  outlined
                  dense
                  label="Ngày vào"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="employee.day_in"
                @input="menuDayin = false"
              ></v-date-picker>
            </v-menu>
          </v-col> -->

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="employee.code_nstl"
                    outlined
                    dense
                    label="mã bác sĩ NSTL"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-checkbox
                    v-model="employee.is_direct_product"
                    :label="`Trực tiếp sản xuất`"
                  ></v-checkbox>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-checkbox
                    v-model="employee.is_toxic_exposure"
                    :label="`Tiếp xúc độc hại`"
                  ></v-checkbox>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-checkbox
                    v-model="employee.is_pause"
                    :label="`Tạm ngưng`"
                  ></v-checkbox>
                </v-col>

                <v-col
                  v-if="!isEdit"
                  cols="12"
                  style="margin-top: -20px"
                  sm="12"
                  lg="12"
                  xl="12"
                  md="12"
                >
                  <v-checkbox
                    v-model="createUser"
                    :label="`Tài khoản`"
                  ></v-checkbox>
                </v-col>

                <v-col
                  v-if="createUser"
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="email"
                    outlined
                    dense
                    label="Email"
                    class="required"
                    color="red"
                  ></v-text-field>
                </v-col>

                <v-col
                  v-if="createUser"
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="password"
                    :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show4 ? 'text' : 'password'"
                    outlined
                    dense
                    label="Mật khẩu"
                    class="required"
                    color="red"
                    hint="Ít nhất 8 kí tự"
                    @click:append="show4 = !show4"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="createUser && !isEdit"
                  cols="12"
                  style="margin-top: -20px"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                >
                  <v-text-field
                    v-model="passwordRepeat"
                    :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, passwordConfirmationRule]"
                    :type="show4 ? 'text' : 'Password'"
                    outlined
                    dense
                    label="Nhập lại Mật khẩu"
                    class="required"
                    color="red"
                    hint="Ít nhất 8 kí tự"
                    @click:append="show4 = !show4"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="n == 2" style="background-color: white">
                <!-- <v-col cols="12" sm="4" lg="4" xl="4" md="4">
                    <v-autocomplete
                      v-model="service_doctor.doctor"
                      label="Bác sĩ"
                      :items="doctors"
                      item-text="fullname"
                      item-value="id"
                      return-object
                      outlined
                      dense
                    ></v-autocomplete>
                  </v-col> -->

                <v-col cols="12" sm="4" lg="4" xl="4" md="4" class="mt-n3">
                  <v-checkbox
                    v-model="service_doctor.is_pause"
                    :label="`tạm ngừng`"
                  ></v-checkbox>
                </v-col>

                <v-col cols="12" sm="8" lg="8" xl="8" md="8">
                  <v-autocomplete
                    v-model="service_doctor.service"
                    label="Dịch vụ"
                    :items="services"
                    :filter="customFilterService"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    clearable
                    dense
                    ><template #append-outer>
                      <v-btn
                        class="mx-2 mt-n2"
                        fab
                        dark
                        small
                        color="white"
                        @click="addToTableNewServiceDoctor()"
                      >
                        <v-icon>mdi-arrow-down-bold-box</v-icon>
                      </v-btn>
                    </template>
                    <template v-slot:item="data">
                      <template>
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="
                              data.item.input_code + ' - ' + data.item.name
                            "
                          ></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" lg="12" xl="12" md="12" class="mt-n3">
                  <v-data-table
                    :headers="ServiceDoctorHeader"
                    :items="service_doctors"
                    item-key="id"
                    class="elevation-1"
                    hide-default-header
                    :footer-props="{
                      itemsPerPageText: 'số dòng mỗi trang',
                      pageText: '{0}-{1} trên {2}',
                    }"
                  >
                    <template #[`item.is_pause`]="{ item }">
                      <v-simple-checkbox
                        v-model="item.is_pause"
                      ></v-simple-checkbox>
                    </template>
                    <template #top>
                      <v-toolbar flat>
                        <v-dialog v-model="dialogDelete" width="unset">
                          <v-sheet outlined color="blue" rounded>
                            <v-card>
                              <v-card-title class="headline"
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
                    <template #[`item.actions`]="{ item }">
                      <v-icon
                        v-if="item.id === null"
                        small
                        @click="deleteNewServiceDoctor(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row></v-container
            ></v-tab-item
          ></v-tabs
        >
      </v-row>
    </v-card>
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
import moment from 'moment-timezone'

const updateemployeeGraphl = gql`
  mutation MyMutation(
    $id: Int
    $work_unit_id: Int
    $internal_hospital_id: Int
    $ward_id: Int
    $unit_code: String
    $title_id: Int
    $state_id: Int
    $short_name: String
    $qualification_id: Int
    $position_id: Int
    $plain_name: String
    $passport_no: String
    $middle_name: String
    $last_name: String
    $is_toxic_exposure: Boolean
    $is_pause: Boolean
    $is_direct_product: Boolean
    $id_card_no: String
    $gender: enum_gender_enum
    $fullname: String
    $first_name: String
    $ethnic_group_id: Int
    $district_id: Int
    $department_id: Int
    $day_in: date
    $country_id: Int
    $code_nstl: String
    $code: String
    $career_id: Int
    $birthday: date
    $address: String
    $objects1: [service_doctors_insert_input!]!
  ) {
    update_employees(
      where: { id: { _eq: $id } }
      _set: {
        address: $address
        birthday: $birthday
        code: $code
        career_id: $career_id
        code_nstl: $code_nstl
        country_id: $country_id
        department_id: $department_id
        day_in: $day_in
        district_id: $district_id
        ethnic_group_id: $ethnic_group_id
        first_name: $first_name
        fullname: $fullname
        gender: $gender
        id_card_no: $id_card_no
        is_direct_product: $is_direct_product
        is_pause: $is_pause
        is_toxic_exposure: $is_toxic_exposure
        last_name: $last_name
        middle_name: $middle_name
        passport_no: $passport_no
        plain_name: $plain_name
        qualification_id: $qualification_id
        position_id: $position_id
        short_name: $short_name
        title_id: $title_id
        unit_code: $unit_code
        ward_id: $ward_id
        work_unit_id: $work_unit_id
        internal_hospital_id: $internal_hospital_id
        state_id: $state_id
      }
    ) {
      affected_rows
    }

    insert_service_doctors(
      objects: $objects1
      on_conflict: {
        constraint: service_doctor_pkey
        update_columns: [service_id, is_pause]
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
    dateFormatted: null,
    editedIndex: -1,
    valid: true,
    menu2: false,
    menuDayin: false,
    dialogDelete: false,
    dialog: false,
    isEdit: true,
    user: {},
    permission: {},
    dialogSave: false,
    createUser: false,
    departments: [],
    snackbar: false,
    textSnackbar: '',
    title_name: '',
    workUnits: [],
    titles: [],
    positions: [],
    qualifications: [],
    careers: [],
    countries: [],
    states: [],
    districts: [],
    wards: [],
    ethnic_groups: [],
    GioiTinh: ['Nam', 'Nữ'],
    employees: [],
    show4: false,
    rules: {
      required: (value) => !!value || 'Bắt buộc nhập.',
      min: (v) => v.length >= 8 || 'Thấp nhất 8 kí tự',
    },
    service_doctors: [],
    service_doctor: {
      id: '',
      is_pause: false,
      doctor_id: null,
      service_id: null,
      doctor: { id: null, fullname: null },
      service: { id: null, name: null },
    },
    services: [],
    email: '',
    password: '',
    passwordRepeat: '',
    ServiceDoctorHeader: [
      {
        text: 'Tên dịch vụ',
        value: 'service.name',
      },
      {
        text: 'Tạm ngừng',
        value: 'is_pause',
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
      {
        text: '',
        value: 'actions',
        sortable: false,
        class: 'blue lighten-2 font-weight-medium text-h4 white--text',
      },
    ],
    employee: {
      id: null,
      code: null,
      first_name: '',
      last_name: '',
      middle_name: '',
      short_name: '',
      plain_name: '',
      fullname: '',
      genderList: [],
      birthday: '',
      gender: 'male',
      address: null,

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

      id_card_no: null,
      passport_no: null,
      is_direct_product: false,
      is_toxic_exposure: false,
      is_pause: false,
      unit_code: null,
      day_in: null,
      code_nstl: null,
    },
  }),
  apollo: {
    // carees: {
    //   query: gql(`query MyQuery {
    //     careers {
    //       code
    //       id
    //       name
    //       plain_name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.careers = data.careers
    //   },
    // },
    // titles: {
    //   query: gql(`query MyQuery {
    //    titles {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.titles = data.titles
    //   },
    // },
    // positions: {
    //   query: gql(`query MyQuery {
    //    positions {
    //       id
    //       name
    //       type
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.positions = data.positions
    //   },
    // },
    // qualifications: {
    //   query: gql(`query MyQuery {
    //    qualifications {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.qualifications = data.qualifications
    //   },
    // },
    // departments: {
    //   query: gql(`query MyQuery {
    //    departments {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.departments = data.departments
    //   },
    // },
    // ethnic_groups: {
    //   query: gql(`query MyQuery {
    //    ethnic_groups {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.ethnic_groups = data.ethnic_groups
    //   },
    // },
    // work_units: {
    //   query: gql(`query MyQuery {
    //    work_units {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.workUnits = data.work_units
    //   },
    // },
    // countries: {
    //   query: gql(`query MyQuery {
    //    countries {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.countries = data.countries
    //   },
    // },
    // states: {
    //   query: gql(`query MyQuery {
    //   states {
    //       id
    //       name
    //       districts {
    //         id
    //         name
    //         state_id
    //         wards {
    //           id
    //           name
    //           district_id
    //         }
    //       }
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.states = data.states
    //   },
    // },
    employees: {
      query() {
        const query = gql(`query MyQuery {
          services(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
            'hospital'
          )}}}){
            id
            name
            service_code
            input_code
            plain_name
          }
          careers(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
            'hospital'
          )}}}) {
          code
          id
          name
          plain_name
        }
        titles(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
         enum_gender{
          code
          name
        }
        positions(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
        qualifications(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
        departments(order_by: {updated_at: desc}, where: {is_pause: {_eq: false} ,internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}})  {
          id
          name
        }
        ethnic_groups(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
        internal_hospitals(order_by: {updated_at: desc}, where: {id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
        countries(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
        }
        states(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
          name
          districts(order_by: {updated_at: desc}) {
            id
            name
            state_id
            wards(order_by: {updated_at: desc}) {
              id
              name
              district_id
            }
          }
        }
        employees(where: {id: {_eq: ${this.objId}}}) {
          internal_hospital_id
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
          enum_gender{
                code
                name
              }
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
                districts {
                  id
                  name
                  state_id
                  wards {
                    id
                    name
                    district_id
                  }
                }
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
          service_doctors(order_by: {updated_at: desc}) {
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
      }`)
        return query
      },
      update: (data) => {},
      result({ data }) {
        this.careers = data.careers
        this.titles = data.titles
        this.positions = data.positions
        this.qualifications = data.qualifications
        this.genderList = data.enum_gender
        this.departments = data.departments
        this.ethnic_groups = data.ethnic_groups
        this.workUnits = data.internal_hospitals
        this.countries = data.countries
        this.states = data.states
        // this.districts = data.states[0].districts
        // this.wards = data.states[0].districts[0].wards
        this.services = data.services
        // this.employee.career = data.careers[0]
        if (data === undefined || data === [] || data.employees.length === 0) {
          console.log('add employee screen')
          this.employee.state = data.states[0]
          // this.employee.district = data.states[0].districts[0]
          // this.employee.ward = data.states[0].districts[0].wards[0]
          this.employee.country = data.countries[0]
          this.employee.work_unit = data.internal_hospitals[0]
          this.employee.department = data.departments[0]
          this.employee.title = data.titles[0]
          this.employee.position = data.positions[0]
        } else {
          this.employee = data.employees[0]
          this.title_name = this.employee.fullname
          if (this.employee.department === null) {
            this.employee.department = { id: null, name: null }
          }
          if (this.employee.work_unit === null) {
            this.employee.work_unit = { id: null, name: null }
          }
          if (this.employee.title === null) {
            this.employee.title = { id: null, name: null }
          }
          if (this.employee.position === null) {
            this.employee.position = { id: null, name: null }
          }
          if (this.employee.qualification === null) {
            this.employee.qualification = { id: null, name: null }
          }
          if (this.employee.country === null) {
            this.employee.country = { id: null, name: null }
          }
          if (this.employee.state === null) {
            this.employee.state = { id: null, name: null }
            this.employee.district = { id: null, name: null }
            this.employee.ward = { id: null, name: null }
          } else {
            this.districts = this.employee.state.districts
            console.log('this.districts', this.districts)
            console.log('this.district', this.employee.district)
            if (this.employee.district === null) {
              this.employee.district = { id: null, name: null }
            } else {
              for (
                let indexDistrict = 0;
                indexDistrict < this.districts.length;
                indexDistrict++
              ) {
                if (
                  this.employee.district.id === this.districts[indexDistrict].id
                ) {
                  this.wards = this.districts[indexDistrict].wards
                  console.log('this.wards', this.wards)
                  console.log('this.ward', this.employee.ward)
                }
              }
            }
          }
          if (this.employee.service_doctors.length > 0) {
            this.service_doctors = this.employee.service_doctors
          }
          // if (this.employee.district === null) {
          //   this.employee.district = { id: null, name: null }
          // }
          if (this.employee.ethnic_group === null) {
            this.employee.ethnic_group = { id: null, name: null }
          }
          // if (this.employee.ward === null) {
          //   this.employee.ward = { id: null, name: null }
          // }
          if (this.employee.career === null) {
            this.employee.career = { id: null, name: null }
          }
        }
      },
    },
    // districts: {
    //   query: gql(`query MyQuery {
    //    districts {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.districts = data.districts
    //   },
    // },
    // wards: {
    //   query: gql(`query MyQuery {
    //    wards {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.wards = data.wards
    //   },
    // },
  },

  computed: {
    passwordConfirmationRule() {
      return () =>
        this.password === this.passwordRepeat || 'Mật khẩu phải giống nhau'
    },
    computedDateFormatted() {
      return this.formatDate(this.employee.birthday)
    },
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete()
    },
    dateFormatted(val) {
      this.parseDate(val)
    },
    'employee.birthday'(val) {
      this.dateFormatted = this.formatDate(this.employee.birthday)
    },
    'employee.state'(newVal) {
      if (newVal) {
        this.districts = newVal.districts
      }
    },

    'employee.district'(newVal) {
      if (newVal) {
        this.wards = newVal.wards
      }
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
              permission_group_details(where: {permission: {code: {_eq: "employees"}}}){
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
      this.employees = []
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
    save() {
      this.dialogSave = false
      if (this.checkInfo()) {
        return
      }
      if (this.isEdit === true) {
        this.dialogSave()
      } else {
        this.addemployeeFunction2()
      }
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      if (
        day === undefined ||
        month === undefined ||
        year === undefined ||
        month > '12' ||
        day > '31' ||
        ((month === '4' ||
          month === '6' ||
          month === '9' ||
          month === '04' ||
          month === '06' ||
          month === '09' ||
          month === '11') &&
          day > '30') ||
        ((month === '02' || month === '2') && day > '29')
      ) {
        this.employee.birthday = ''
        return null
      }
      return `${day}-${month}-${year}`
    },
    deleteItemConfirm() {
      this.service_doctors.splice(this.editedIndex, 1)
      this.closeDelete()
      return 'sucess'
    },

    checkInfo() {
      // if (this.employee.country.id === null) {
      //   this.textSnackbar = 'Vui lòng nhập quốc tịch'
      //   this.snackbar = true
      //   return true
      // }
      // if (this.employee.state.id === null) {
      //   this.textSnackbar = 'Vui lòng chọn tỉnh/thành'
      //   this.snackbar = true
      //   return true
      // }
      // if (this.employee.district.id === null) {
      //   this.textSnackbar = 'Vui lòng chọn quận/huyện/tp trực thuộc'
      //   this.snackbar = true
      //   return true
      // }
      //  if (this.employee.ward.id === null) {
      //   this.textSnackbar = 'Vui lòng chọn phường/xã'
      //   this.snackbar = true
      //   return true
      // }
      if (this.employee.state.id === null) {
        this.employee.state = { id: null, name: null }
      }

      if (this.employee.district.id === null) {
        this.employee.district = { id: null, name: null }
      }

      if (this.employee.ward.id === null) {
        this.employee.ward = { id: null, name: null }
      }

      if (this.employee.birthday === '') {
        this.textSnackbar = 'Vui lòng chọn ngày sinh'
        this.snackbar = true
        return true
      }
      this.employee.fullname =
        this.employee.last_name +
        ' ' +
        this.employee.middle_name +
        ' ' +
        this.employee.first_name
      if (this.employee.fullname === '  ') {
        this.textSnackbar = 'Vui lòng nhập họ tên'
        this.snackbar = true
        return true
      }
      if (this.employee.code === '' || this.employee.code === null) {
        this.textSnackbar = 'Vui lòng nhập mã nhân viên'
        this.snackbar = true
        return true
      }
      if (this.createUser === true) {
        if (this.email === '' || this.password === '') {
          this.textSnackbar = 'Vui lòng nhập đủ thông tin tài khoản'
          this.snackbar = true
          return true
        }
        if (this.password !== this.passwordRepeat) {
          this.textSnackbar = 'Mật khẩu phải giống nhau'
          this.snackbar = true
          return true
        }
      }
      return false
    },
    closeDelete() {
      this.dialogDelete = false
    },
    customFilterService(item, queryText, itemText) {
      const textThree = item.plain_name.toLowerCase()
      const textOne = item.name.toLowerCase()
      const textTwo = item.input_code
      const searchText = queryText.toLowerCase()
      // let temp = []
      // if (textOne.includes(searchText)) {
      //   temp = textOne.indexOf(searchText)
      // }
      // if (textTwo.includes(searchText)) {
      //   temp = textTwo.indexOf(searchText)
      // }
      // return temp
      return (
        textOne.includes(searchText) ||
        textTwo.includes(searchText) ||
        textThree.includes(searchText)
      )
    },
    deleteNewServiceDoctor(item) {
      this.editedIndex = this.service_doctors.indexOf(item)
      console.log('testdelete', this.editedIndex)
      this.dialogDelete = true
    },
    addToTableNewServiceDoctor() {
      if (
        this.service_doctor.service === null ||
        this.service_doctor.service.id === null
      ) {
        this.textSnackbar = 'Vui lòng chọn dịch vụ'
        this.snackbar = true
        return
      }
      for (let index = 0; index < this.service_doctors.length; index++) {
        const element = this.service_doctors[index]
        if (this.service_doctor.service.id === element.service.id) {
          this.textSnackbar = 'Dịch vụ đã có trong bảng'
          this.snackbar = true
          return
        }
      }
      if (this.isEdit) {
        this.obj = {
          id: null,
          service: {
            id: this.service_doctor.service.id,
            name: this.service_doctor.service.name,
          },
          is_pause: this.service_doctor.is_pause,
        }
      } else {
        this.obj = {
          id: null,
          service: {
            id: this.service_doctor.service.id,
            name: this.service_doctor.service.name,
          },
          is_pause: this.service_doctor.is_pause,
        }
      }

      this.service_doctors.push(this.obj)
    },
    parseDate(date) {
      if (!date) return null
      if (/^[0-9-/]*$/.test(date)) {
        //   // const [day, month, year] = date.split('/')
        // let day = ''
        // let month = ''
        // let year = ''
        let isLeap = false
        if (date.length === 2) {
          date = date + '-'
        }
        if (date.length === 4 && date[3] > '1') {
          date = date[0] + date[1] + '-0' + date[3]
        }
        if (date.length === 5) {
          date = date + '-'
        }
        let [day, month, year] = []
        if (date.length === 10) {
          // day = date[0] + date[1]
          // month = date[3] + date[4]
          // year = date[4] + date[5] + date[6] + date[7]
          // console.log('year', year)
          ;[day, month, year] = date.split('-')
          isLeap = new Date(year, 1, 29).getMonth() === 1
        }
        this.dateFormatted = date

        if (date.length === 10) {
          if (
            // day === '' ||
            // month === '' ||
            // year === '' ||
            month > '12' ||
            day > '31' ||
            ((month === '4' ||
              month === '6' ||
              month === '9' ||
              month === '04' ||
              month === '06' ||
              month === '09' ||
              month === '11') &&
              day > '30') ||
            (isLeap && month === '02' && day > '28') ||
            (!isLeap && month === '02' && day > '29') ||
            moment(`${year}-${month}-${day}`).isAfter(
              moment().format('YYYY-MM-DD')
            )
          ) {
            this.textSnackbar = 'Nhập ngày ko đúng định dạng'
            this.snackbar = true
            this.employee.birthday = ''
            this.dateFormatted = ''
            return null
          }
          return `${year}-${month}-${day}`
        }
      } else {
        this.textSnackbar = 'Nhập ngày ko đúng định dạng'
        this.snackbar = true
        this.employee.birthday = ''
        this.dateFormatted = ''
      }
    },
    backToList() {
      this.$router.push({
        path: `/list/old_core/employee/doctors`,
      })
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
    updateemployeeFunction() {
      const fullnameString =
        this.employee.last_name +
        ' ' +
        this.employee.middle_name +
        ' ' +
        this.employee.first_name
      const plainName = this.convertViToEn(fullnameString)

      const data_item = []
      if (this.service_doctors.length > 0) {
        for (let index = 0; index < this.service_doctors.length; index++) {
          const element = this.service_doctors[index]
          const doctor_service_doctor = {}
          if (element.id != null) {
            doctor_service_doctor.id = element.id
          }
          doctor_service_doctor.service_id = element.service.id
          doctor_service_doctor.doctor_id = this.employee.id
          doctor_service_doctor.is_pause = element.is_pause
          data_item.push(doctor_service_doctor)
        }
      }

      this.$apollo.mutate({
        mutation: updateemployeeGraphl,
        variables: {
          id: this.employee.id,
          address: this.employee.address,
          birthday: this.employee.birthday,
          code: this.employee.code,
          code_nstl: this.employee.code_nstl,
          day_in: this.employee.day_in,
          first_name: this.employee.first_name,
          fullname: fullnameString,
          gender: this.employee.enum_gender.code,
          id_card_no: this.employee.id_card_no,
          is_direct_product: this.employee.is_direct_product,
          is_pause: this.employee.is_pause,
          is_toxic_exposure: this.employee.is_toxic_exposure,
          last_name: this.employee.last_name,
          middle_name: this.employee.middle_name,
          passport_no: this.employee.passport_no,
          plain_name: plainName,
          short_name: this.employee.short_name,
          unit_code: this.employee.unit_code,
          ward_id: this.employee.ward.id,
          title_id: this.employee.title.id,
          work_unit_id: this.employee.work_unit.id,
          internal_hospital_id: this.employee.work_unit.id,
          state_id: this.employee.state.id,
          ethnic_group_id: this.employee.ethnic_group.id,
          position_id: this.employee.position.id,
          qualification_id: this.employee.qualification.id,
          department_id: this.employee.department.id,
          district_id: this.employee.district.id,
          career_id: this.employee.career.id,
          country_id: this.employee.country.id,
          objects1: data_item,
        },
        update: (store, { data: { update_employees } }) => {
          if (update_employees.affected_rows) {
            // eslint-disable-next-line
            this.textSnackbar = 'Cập nhật bác sĩ thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Cập nhật bác sĩ thất bại'
            this.snackbar = true
          }
        },
      })
    },
    awaitDirect() {
      setTimeout(() => this.backToList(), 1500)
    },
    async addemployeeFunction2() {
      console.log('data_employees')
      const fullnameString =
        this.employee.last_name +
        ' ' +
        this.employee.middle_name +
        ' ' +
        this.employee.first_name
      const plainName = this.convertViToEn(fullnameString)
      const data_employees = {}
      data_employees.address = this.employee.address
      data_employees.birthday = this.employee.birthday
      data_employees.code = this.employee.code
      data_employees.career_id = this.employee.career.id
      data_employees.code_nstl = this.employee.code_nstl
      data_employees.country_id = this.employee.country.id
      data_employees.department_id = this.employee.department.id
      data_employees.day_in = this.employee.day_in
      data_employees.district_id = this.employee.district.id
      data_employees.ethnic_group_id = this.employee.ethnic_group.id
      data_employees.first_name = this.employee.first_name
      data_employees.fullname = fullnameString
      data_employees.gender = this.employee.enum_gender.code
      data_employees.id_card_no = this.employee.id_card_no
      data_employees.is_direct_product = this.employee.is_direct_product
      data_employees.is_pause = this.employee.is_pause
      data_employees.is_toxic_exposure = this.employee.is_toxic_exposure
      data_employees.last_name = this.employee.last_name
      data_employees.middle_name = this.employee.middle_name
      data_employees.passport_no = this.employee.passport_no
      data_employees.plain_name = plainName
      data_employees.qualification_id = this.employee.qualification.id
      data_employees.position_id = this.employee.position.id
      data_employees.short_name = this.employee.short_name
      data_employees.title_id = this.employee.title.id
      data_employees.state_id = this.employee.state.id
      data_employees.unit_code = this.employee.unit_code
      data_employees.ward_id = this.employee.ward.id
      data_employees.work_unit_id = this.employee.work_unit.id
      data_employees.internal_hospital_id = this.employee.work_unit.id
      data_employees.type = 'BS'

      this.employee.ward_id = this.employee.ward.id
      this.employee.title_id = this.employee.title.id
      this.employee.work_unit_id = this.employee.work_unit.id
      this.employee.internal_hospital_id = this.employee.work_unit.id
      this.employee.state_id = this.employee.state.id
      this.employee.ethnic_group_id = this.employee.ethnic_group.id
      this.employee.position_id = this.employee.position.id
      this.employee.qualification_id = this.employee.qualification.id
      this.employee.department_id = this.employee.department.id
      this.employee.district_id = this.employee.district.id
      this.employee.career_id = this.employee.career.id
      this.employee.country_id = this.employee.country.id

      if (this.service_doctors.length > 0) {
        const data_item = []
        for (let index = 0; index < this.service_doctors.length; index++) {
          const element = this.service_doctors[index]
          const doctor_service_doctor = {}
          doctor_service_doctor.service_id = element.service.id
          doctor_service_doctor.is_pause = element.is_pause
          data_item.push(doctor_service_doctor)
        }
        const data_temp = {}
        data_temp.data = data_item
        data_employees.service_doctors = data_temp
      }

      if (this.createUser === true) {
        const users = {}
        users.email = this.email
        users.fullname = fullnameString
        users.nickname = plainName
        users.role = 'doctor'
        users.internal_hospital_id = this.employee.work_unit.id

        const query = `mutation MyMutation {
                       createUser(email: "${users.email}", fullname: "${users.fullname}", password: "${this.password}") {
                       uid
                       }
                       }`
        // console.log('query', query)
        await this.$apollo
          .mutate({
            mutation: gql(query),
          })
          .then((res) => {
            console.log('res', res)

            users.id = res.data.createUser.uid
            const temp = {}
            temp.data = users
            data_employees.users = temp
            const query = `mutation MyMutation($objects: [employees_insert_input!]!) {
            insert_employees(objects: $objects) {
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
                objects: data_employees,
              },
              update: (store, { data: { insert_employees } }) => {
                if (insert_employees.affected_rows) {
                  // eslint-disable-next-line
                  this.$apollo.queries.employees.refetch()
                  this.textSnackbar = 'Thêm bác sĩ thành công'
                  this.snackbar = true
                  this.awaitDirect()
                } else {
                  this.textSnackbar = 'Thêm bác sĩ thất bại'
                  this.snackbar = true
                }
              },
            })
          })
          .catch((response) => {
            this.textSnackbar = 'Email đã được sử dụng'
            this.snackbar = true
          })
      } else {
        const query = `mutation MyMutation($objects: [employees_insert_input!]!) {
            insert_employees(objects: $objects) {
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
            objects: data_employees,
          },
          update: (store, { data: { insert_employees } }) => {
            if (insert_employees.affected_rows) {
              // eslint-disable-next-line
              this.$apollo.queries.employees.refetch()
              this.textSnackbar = 'Thêm bác sĩ thành công'
              this.awaitDirect()
              this.snackbar = true
            } else {
              this.textSnackbar = 'Thêm bác sĩ thất bại'
              this.snackbar = true
            }
          },
        })
      }
    },
  },
}
</script>
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
