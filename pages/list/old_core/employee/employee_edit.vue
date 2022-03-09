<template>
  <v-form id="edit-form" ref="form" v-model="valid" lazy-validation>
    <v-toolbar flat>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="backToList()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Quay lại danh sách Nhân viên </span>
      </v-tooltip>

      <v-toolbar-title v-if="isEdit" class="blue--text font-weight-bold">{{
        `Chỉnh sửa nhân viên: ${title_name}`
      }}</v-toolbar-title>
      <v-toolbar-title v-if="!isEdit" class="blue--text font-weight-bold">{{
        `Thêm nhân viên `
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
    <v-card class="mx-auto" outlined>
      <v-row class="pa-5">
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
            label="Mã nhân viên"
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
                class="required"
                color="red"
                hint="Ngày-Tháng-Năm (vd: 15-02-1999)"
                @blur="employee.birthday = parseDate(dateFormatted, 'birthday')"
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
          <!-- <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="employee.birthday"
                  outlined
                  dense
                  label="Ngày Sinh"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="employee.birthday"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu> -->
        </v-col>

        <v-col cols="12" sm="4" lg="4" xl="4" md="4">
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
        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
          <v-text-field
            v-model="employee.last_name"
            outlined
            dense
            label="Họ"
            class="required"
            color="red"
          ></v-text-field>
        </v-col>

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
          <v-text-field
            v-model="employee.middle_name"
            outlined
            dense
            label="Tên đệm"
          ></v-text-field>
        </v-col>

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
          <v-text-field
            v-model="employee.first_name"
            outlined
            dense
            label="Tên"
            class="required"
            color="red"
          ></v-text-field>
        </v-col>

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
          <v-text-field
            v-model="employee.id_card_no"
            outlined
            dense
            label="CMND/Passport"
          ></v-text-field>
        </v-col>

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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

        <v-col cols="12" style="margin-top: -20px" sm="8" lg="8" xl="8" md="8">
          <v-text-field
            v-model="employee.address"
            outlined
            dense
            label="Địa chỉ"
          ></v-text-field>
        </v-col>

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
          <v-autocomplete
            v-model="employee.state"
            label="Thành phố"
            :items="states"
            item-text="name"
            item-value="id"
            return-object
            outlined
            dense
            clearable
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
          <v-autocomplete
            v-model="employee.district"
            label="Quận/Huyện"
            :items="districts"
            item-text="name"
            item-value="id"
            clearable
            return-object
            outlined
            dense
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
          <v-autocomplete
            v-model="employee.ward"
            label="Phường/Xã"
            :items="wards"
            item-text="name"
            item-value="id"
            return-object
            outlined
            clearable
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
        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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
        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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
          v-if="employee.department.name === 'Quầy tiếp nhận'"
          cols="12"
          style="margin-top: -30px"
          sm="4"
          lg="4"
          xl="4"
          md="4"
        >
          <v-checkbox
            v-model="employee.save_reception_permission"
            :label="`Được phép thanh toán`"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
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
          </v-col> -->

        <!-- <v-col
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

        <v-col cols="12" style="margin-top: -20px" sm="4" lg="4" xl="4" md="4">
          <v-text-field
            v-model="employee.code_nstl"
            outlined
            dense
            label="mã nhân viên NSTL"
          ></v-text-field>
        </v-col>

        <v-col cols="12" style="margin-top: -30px" sm="4" lg="4" xl="4" md="4">
          <v-checkbox
            v-model="employee.is_direct_product"
            :label="`Trực tiếp sản xuất`"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" style="margin-top: -30px" sm="4" lg="4" xl="4" md="4">
          <v-checkbox
            v-model="employee.is_toxic_exposure"
            :label="`Tiếp xúc độc hại`"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" style="margin-top: -30px" sm="4" lg="4" xl="4" md="4">
          <v-checkbox
            v-model="employee.is_pause"
            :label="`Tạm ngưng`"
          ></v-checkbox>
        </v-col>

        <v-col
          v-if="!isEdit"
          cols="12"
          style="margin-top: -30px"
          sm="12"
          lg="12"
          xl="12"
          md="12"
        >
          <v-checkbox v-model="createUser" :label="`Tài khoản`"></v-checkbox>
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
            class="required"
            color="red"
            label="Email"
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
            class="required"
            color="red"
            label="Mật khẩu"
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
            class="required"
            color="red"
            label="Nhập lại Mật khẩu"
            hint="Ít nhất 8 kí tự"
            @click:append="show4 = !show4"
          ></v-text-field>
        </v-col>
        <v-col
          v-if="createUser"
          cols="12"
          sm="4"
          lg="4"
          xl="4"
          md="4"
          style="margin-top: -20px"
        >
          <v-autocomplete
            v-model="permission_group"
            label="Phân quyền"
            :items="permission_groups"
            item-text="name"
            item-value="id"
            return-object
            outlined
            dense
          ></v-autocomplete>
        </v-col>
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
    $save_reception_permission: Boolean
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
        save_reception_permission: $save_reception_permission
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
    valid: false,
    createUser: false,
    show4: false,
    email: '',
    genderList: [],
    password: '',
    permission_group: {
      id: null,
      name: null,
    },
    passwordRepeat: '',
    rules: {
      required: (value) => !!value || 'Bắt buộc nhập.',
      min: (v) => v.length >= 8 || 'Thấp nhất 8 kí tự',
    },
    confirmPasswordRules: [
      (value) => !!value || 'type confirm password',
      (value) =>
        value === this.password || 'The password confirmation does not match.',
    ],
    menu2: false,
    menuDayin: false,
    dialogDelete: false,
    dialog: false,
    user: {},
    permission: {},
    isEdit: true,
    dialogSave: false,
    departments: [],
    departmentSingle: [],
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
    permission_groups: [],

    wards: [],
    ethnic_groups: [],
    GioiTinh: ['Nam', 'Nữ'],
    employees: [],
    employee: {
      id: null,
      code: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      save_reception_permission: true,
      short_name: '',
      plain_name: '',
      fullname: '',
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
    //    positions(where: {type: {_eq: 0}}) {
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
    departmentSingle: {
      query() {
        const query = gql(`query MyQuery {
        departments(order_by: {updated_at: desc}, where: {is_pause: {_eq: false} ,internal_hospital_id: {_eq:0}}) {
          id
          name
        }
        
      }`)
        return query
      },
      update: (data) => {},
      result({ data }) {
        this.departmentSingle = data.departments
      },
    },
    employees: {
      query() {
        const query = gql(`query MyQuery {
            careers(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
              'hospital'
            )}}}) {
          code
          id
          name
          plain_name
        }
         permission_groups {
          id
          name
        }
         enum_gender{
          code
          name
        }
        titles(order_by: {updated_at: desc}, where: {internal_hospital_id: {_eq: ${localStorage.getItem(
          'hospital'
        )}}}) {
          id
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
        )}}}) {
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
        )}}}){
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
          save_reception_permission
          position_id
          plain_name
          passport_no
          middle_name
          last_name
          enum_gender{
                code
                name
              }
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

        }
      }`)
        return query
      },
      update: (data) => {},
      result({ data }) {
        this.careers = data.careers
        this.titles = data.titles
        this.positions = data.positions
        this.permission_groups = data.permission_groups
        this.qualifications = data.qualifications
        this.departments = []
        this.departments = data.departments
        this.departments.push(this.departmentSingle[0])
        this.genderList = data.enum_gender
        this.ethnic_groups = data.ethnic_groups
        this.workUnits = data.internal_hospitals
        this.countries = data.countries
        this.states = data.states
        // this.districts = data.states[0].districts
        // this.wards = data.states[0].districts[0].wards

        if (data === undefined || data === [] || data.employees.length === 0) {
          this.user.permission_group = data.permission_groups[0]
          this.employee.country = data.countries[0]
          this.employee.work_unit = data.internal_hospitals[0]
          this.employee.department = data.departments[0]
          this.employee.title = data.titles[0]
          this.employee.position = data.positions[0]
          this.employee.enum_gender = {
            code: 'male',
            name: 'Nam',
          }
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
                }
              }
            }
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
    awaitDirect() {
      setTimeout(() => this.backToList(), 1500)
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
    checkInfo() {
      if (this.employee.middle_name === null) {
        this.employee.middle_name = ''
      }
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
        if (this.permission_group.id === null) {
          this.textSnackbar = 'Vui lòng chọn quyền'
          this.snackbar = true
          return true
        }
      }
      return false
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
        this.dateFormatted = ' '
        this.dateFormatted = ''
      }
      // const [day, month, year] = date.split('/')
    },
    save() {
      this.dialogSave = false
      if (this.checkInfo()) {
        return
      }

      if (this.isEdit === true) {
        this.updateemployeeFunction()
      } else {
        this.addemployeeFunction2()
      }
    },
    backToList() {
      this.$router.push({
        path: `/list/old_core/employee/employees`,
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
          save_reception_permission: this.employee.save_reception_permission,
        },
        update: (store, { data: { update_employees } }) => {
          if (update_employees.affected_rows) {
            // eslint-disable-next-line
            this.textSnackbar = 'Cập nhật nhân viên thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Cập nhật nhân viên thất bại'
            this.snackbar = true
          }
        },
      })
    },
    async onBeforeSubmit(data, formMode, that) {
      let uid = data.id
      if (formMode === 'add') {
        // console.log('ftgtgtg', data)
        const query = `mutation MyMutation {
                       createUser(email: "${data.email}", fullname: "${data.fullname}", password: "${data.password}") {
                       uid
                       }
                       }`
        // console.log('query', query)
        await that.$apollo
          .mutate({
            mutation: gql(query),
          })
          .then((res) => {
            // console.log('res', res)
            uid = res.data.createUser.uid
            data.id = uid
          })
      } else if (formMode === 'changePassword') {
        if (data.password !== '' && data.password !== undefined) {
          const query1 = `mutation MyMutation {
                       changePassword(password: "${data.password}", uid: "${data.id}") {
                         uid
                       }
                     }`
          // console.log('query', query)
          await that.$apollo
            .mutate({
              mutation: gql(query1),
            })
            .then((res) => {
              // console.log('res', res)
              uid = res.data.changePassword.uid
            })
        }
      }
    },

    async addemployeeFunction2() {
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
      data_employees.unit_code = this.employee.unit_code
      data_employees.ward_id = this.employee.ward.id
      data_employees.work_unit_id = this.employee.work_unit.id
      data_employees.internal_hospital_id = this.employee.work_unit.id
      data_employees.state_id = this.employee.state.id
      data_employees.save_reception_permission = this.employee.save_reception_permission
      data_employees.type = 'NV'

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

      if (this.createUser === true) {
        const users = {}
        users.email = this.email
        users.fullname = fullnameString
        users.nickname = plainName
        users.role = 'user'
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
            // console.log('res', res)

            users.id = res.data.createUser.uid
            users.permission_group_id = this.permission_group.id
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
                  this.textSnackbar = 'Thêm nhân viên thành công'
                  this.snackbar = true
                  this.awaitDirect()
                } else {
                  this.textSnackbar = 'Thêm nhân viên thất bại'
                  this.snackbar = true
                }
              },
            })
          })
          .catch((response) => {
            this.textSnackbar = 'Email đã được sử dụng'
            this.snackbar = true
          })
        // firebase
        //   .auth()
        //   .createUserWithEmailAndPassword(this.email, this.password)
        //   .then((data) => {
        //     console.log(data.user.uid)
        //     // data.user
        //     //   .updateProfile({
        //     //     displayName: fullnameString,
        //     //   })
        //     //   .then(() => {})
        //   })
        //   .catch((err) => {
        //     this.error = err.message
        //     console.log(err)
        //     if (err.code === 400) {
        //       this.textSnackbar = 'Email đã được sử dụng'
        //     } else {
        //       this.textSnackbar = err.message
        //     }
        //     this.snackbar = true
        //   })
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
              this.textSnackbar = 'Thêm nhân viên thành công'
              this.snackbar = true
              this.awaitDirect()
            } else {
              this.textSnackbar = 'Thêm nhân viên thất bại'
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
