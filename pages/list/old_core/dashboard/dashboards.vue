<template>
  <v-form id="edit-form" ref="form" v-model="valid" lazy-validation>
    <v-toolbar flat>
      <v-toolbar-title v-if="isEdit" class="blue--text font-weight-bold">{{
        `Kê đơn thuốc`
      }}</v-toolbar-title>
      <v-toolbar-title v-if="!isEdit" class="blue--text font-weight-bold">{{
        `Thêm đơn thuốc `
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
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
            <v-row class="pa-3">
              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model="receptionIdInput"
                  autofocus
                  id="focusRecepInput"
                  label="Số phiếu"
                  outlined
                  dense
                  type="number"
                  hide-details
                  class="required"
                  color="red"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model="medical_code"
                  label="Mã bệnh nhân"
                  disabled
                  outlined
                  dense
                  hide-details
                  class="required"
                  color="red"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" lg="4" xl="4" md="4">
                <v-text-field
                  v-model="fullname"
                  label="Tên bệnh nhân"
                  disabled
                  outlined
                  dense
                  hide-details
                  class="required"
                  color="red"
                ></v-text-field>
                <!-- :color="patientInfo.fullname ? 'black' : 'red'" -->
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model="gender"
                  label="Giới tính"
                  disabled
                  outlined
                  dense
                  hide-details
                  class="required"
                  color="red"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model="birthday"
                  label="Ngày sinh"
                  disabled
                  outlined
                  dense
                  hide-details
                  class="required"
                  color="red"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="4" lg="4" xl="4" md="4">
                <v-text-field
                  v-model="object_patients"
                  label="Đối tượng"
                  disabled
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="4" sm="8" lg="8" xl="8" md="8">
                <v-text-field
                  v-model="diagnose"
                  label="Chẩn đoán"
                  outlined
                  disabled
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" lg="3" xl="3" md="3">
                <v-autocomplete
                  v-model="medicineNameInput"
                  label="Tên thuốc"
                  :items="medicine_name"
                  item-text="name"
                  item-value="name"
                  outlined
                  class="require"
                  color="red"
                  dense
                  hide-details
                  clearable
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                <v-text-field
                  v-model="medicineUnit"
                  label="Đơn vị tính"
                  item-text="unit"
                  outlined
                  disabled
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-row class="pa-3">
                <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                  <v-text-field
                    v-model="medicine_use"
                    label="Đơn vị sử dụng"
                    outlined
                    dense
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                  <v-text-field
                    v-model.number="amount_day"
                    label="Số ngày"
                    outlined
                    type="number"
                    id="dayInput"
                    dense
                    hide-details
                  ></v-text-field>
                </v-col>

                <v-col cols="4" sm="1" lg="1" xl="1" md="1">
                  <v-text-field
                    v-model.number="amount_morning"
                    label="Sáng"
                    outlined
                    type="number"
                    dense
                    id="morningInput"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="4" sm="1" lg="1" xl="1" md="1">
                  <v-text-field
                    v-model.number="amount_evening"
                    label="Trưa"
                    outlined
                    type="number"
                    dense
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="4" sm="1" lg="1" xl="1" md="1">
                  <v-text-field
                    v-model.number="amount_afternoon"
                    label="Chiều"
                    outlined
                    hide-details
                    type="number"
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="4" sm="1" lg="1" xl="1" md="1">
                  <v-text-field
                    v-model.number="amount_night"
                    label="Tối"
                    outlined
                    type="number"
                    dense
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-col cols="4" sm="12" lg="12" xl="12" md="12">
                <v-text-field
                  v-model="note_prescription"
                  label="Ghi chú"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
            <client-only>
              <v-data-table
                :headers="headers"
                :items="list_medicines_add"
                :server-items-length="getTotalData()"
                :items-per-page="itemsPerPage"
                :footer-props="{
                  itemsPerPageText: 'số dòng mỗi trang',
                  pageText: '{0}-{1} trên {2}',
                }"
                class="elevation-1 text-center"
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

                    <v-dialog v-model="dialogWarning" width="unset">
                      <v-sheet outlined color="blue" rounded>
                        <v-card>
                          <v-card-title class="headline blue--text" style="">
                            <h5 class="text-uppercase">
                              {{ title_popup_warning }}
                            </h5>
                            <hr />
                            <p style="padding-top: 10px">
                              {{ content_popup_warning }}
                            </p>
                            <p v-if="!isInputNull"><br />Tiếp tục thêm?</p>
                          </v-card-title>
                          <v-card-actions v-if="!isInputNull">
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              @click="
                                ;(dialogWarning = false),
                                  (title_popup_warning = ''),
                                  (content_popup_warning = '')
                              "
                              text
                              >Không</v-btn
                            >
                            <v-btn
                              color="error"
                              @click="
                                ;(is_add_medicine = true),
                                  add(),
                                  (dialogWarning = false)
                              "
                              text
                              >Có</v-btn
                            >
                            <v-spacer></v-spacer>
                          </v-card-actions>
                          <v-card-actions v-else>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              @click="
                                ;(dialogWarning = false),
                                  (title_popup_warning = ''),
                                  (content_popup_warning = '')
                              "
                              text
                              >OK</v-btn
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
    isInputNull: false,
    medical_code: '',
    fullname: '',
    gender: '',
    birthday: '',
    object_patients: '',
    medicineNameInput: '',
    medicineUnit: '',
    medicineInfo: [],
    receptionIdInput: '',
    patientInfo: [],
    valid: false,
    isEdit: true,
    dialogSave: false,
    user: {},
    permission: {},
    departments_parent_list: [],
    medicines_list: [],
    medicine_name: [],
    snackbar: false,
    textSnackbar: '',
    // department_types: [],
    // hospitals: [],
    // patients.vue
    search: '',
    dialogWarning: false,
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
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: 'Tên thuốc',
        value: 'name',
        dataFilter: '',
        type: 'String',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: 'Sáng',
        value: 'mor_num',
        dataFilter: '',
        type: 'String',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: 'Trưa',
        value: 'eve_num',
        type: 'String',
        dataFilter: '',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: 'Chiều',
        value: 'aft_num',
        type: 'Date',
        dataFilter: '',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: 'Tối',
        value: 'nig_num',
        type: 'String',
        dataFilter: '',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: 'Tổng số lượng',
        value: 'total',
        type: 'String',
        dataFilter: '',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: 'Cách sử dụng',
        value: 'use_way',
        type: 'String',
        dataFilter: '',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: 'Ghi chú',
        value: 'note',
        type: 'String',
        dataFilter: '',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
      },
      {
        text: '',
        value: '',
        sortable: false,
        class:
          'blue lighten-2 font-weight-medium text-h5 white--text text-center',
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
    list_medicines: [],
    prescription_info: [],
    maximum_dose: 0,
    // data đưa thuốc vào đơn
    medicine_choose: [],
    medicine_name_choose: [],
    list_medicines_add: [],
    stt_medicine_list: 0,
    amount_morning: 0,
    amount_evening: 0,
    amount_afternoon: 0,
    amount_night: 0,
    amount_day: 0,
    medicine_use: '',
    note_prescription: '',
    diagnose: '',
    is_add_medicine: false,
    use_way: [],
    // thông tin bệnh nhân
    to_day: new Date(),
    year_month_day: '',
    patient_age: 0,
    // data warning
    str: [],
    str_case: [],
    casename_content: [],
    casename_warning: '',
    content_warning: [],
    popup_contents: [],
    title_popup_warning: '',
    content_popup_warning: '',
    search_dianose: '',
    allergy_warning: [],
    allergy_medicine: [],

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
    medicines: {
      medicine_name: { id: null, name: null },
      medicine_name_choose: { name: null },
      medicine_name_id: '',
      unit: null,
    },
  }),

  apollo: {
    // patients.vue
    // lấy tổng data
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
        return !this.list_medicines_add
      },
    },

    patientInfo: {
      query() {
        this.medical_code = ''
        this.fullname = ''
        this.gender = ''
        this.birthday = ''
        this.object_patients = ''
        this.diagnose = ''
        if (this.receptionIdInput === '') {
          return gql(`query MyQuery {
              receptions(where: { id: { _eq: 0 } }) {
                patient {
                  fullname
                  gender
                  birthday
                  medical_code
                  object_patients
                }
                medical_examinations {
                  diagnosis_icd
                }
              }
            }`)
        } else {
          return gql(`query MyQuery {
              receptions(where: { id: { _eq: ${this.receptionIdInput} } }) {
                patient {
                  fullname
                  gender
                  birthday
                  medical_code
                  object_patients
                }
                medical_examinations {
                  diagnosis_icd
                }
              }
            }`)
        }
      },

      result(data) {
        const resData = data.data.receptions[0]
        if (resData) {
          if (resData.patient) {
            this.medical_code = resData.patient.medical_code
            this.fullname = resData.patient.fullname
            this.gender = resData.patient.gender
            this.birthday = resData.patient.birthday
            this.object_patients = resData.patient.object_patients
            this.patientInfo = resData.patient
            this.year_month_day = this.patientInfo.birthday.split('-')
            this.patient_age =
              Number(this.to_day.getFullYear()) - Number(this.year_month_day[0])
            if (
              Number(this.to_day.getFullYear()) ===
              Number(this.year_month_day[0])
            ) {
              this.patient_age =
                Number(this.to_day.getMonth()) +
                1 -
                Number(this.year_month_day[1])
            }
            // console.log(
            //   'Number(this.to_day.getMonth()): ' +
            //     Number(this.to_day.getMonth())
            // )
            // console.log('tháng bệnh nhân: ' + this.patient_age)
          }
          if (resData.medical_examinations[0]) {
            this.diagnose = resData.medical_examinations[0].diagnosis_icd
          }
          // console.log('patientInsfsdfsdfo', data)
        }
      },
      update(data) {
        const resData = data.receptions[0]
        if (resData) {
          if (resData.patient) {
            this.medical_code = resData.patient.medical_code
            this.fullname = resData.patient.fullname
            this.gender = resData.patient.gender
            this.birthday = resData.patient.birthday
            this.object_patients = resData.patient.object_patients
            this.patientInfo = resData.patient
          }
          if (resData.medical_examinations[0]) {
            this.diagnose = resData.medical_examinations[0].diagnosis_icd
          }
          // console.log('patientInsfsdfsdfo', data)
        }
      },
      skip() {
        return !this.receptionIdInput
      },
    },

    medicineInfo: {
      query() {
        if (this.amount_morning === '') {
          this.amount_morning = 0
        }
        if (this.amount_evening === '') {
          this.amount_evening = 0
        }
        if (this.amount_afternoon === '') {
          this.amount_afternoon = 0
        }
        if (this.amount_night === '') {
          this.amount_night = 0
        }

        if (this.medicineNameInput === '') {
          this.medicineInfo.unit = 0
          this.amount_morning = 0
          this.amount_evening = 0
          this.amount_afternoon = 0
          this.amount_night = 0
          this.note_prescription = ''
          this.medicine_use = ''
          return gql(`query MyQuery {
            medicines(where: {medicine_name: {name: {_eq: "0"}}}) {
              unit
            }
          }`)
        } else {
          return gql(`query MyQuery {
            medicines(where: {medicine_name: {name: {_eq: "${this.medicineNameInput}"}}}) {
              unit
            }
          }`)
        }
      },

      result(datae) {
        if (datae.data.medicines[0]) {
          // console.log('this.receptionIdInput', this.receptionIdInput)
          this.medicineUnit = datae.data.medicines[0].unit
          // console.log('medicineInfo resutlt', this.medicineInfo)
        }
      },
      update(datab) {
        if (datab.medicines[0]) {
          this.medicineUnit = datab.medicines[0].unit
          // console.log('medicineInfo update', this.medicineInfo)
        }
      },
      skip() {
        return !this.medicineNameInput
      },
    },

    // hiện data
    patients: {
      query() {
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

    medicine_choose: {
      query() {
        if (this.medicineNameInput === '') {
          this.medicine_name_choose = []
          return gql(`query MyQuery {
                    medicines(where: {medicine_name: {name: {_eq: "0"}}}) {
                      medicine_name {
                        name
                        id
                      }
                      medicine_guide {
                        name
                      }
                      unit
                      medicine_name_id
                    }
                    medicine_names(where: {name: {_eq: "0"}}){
                      name
                    }
                  }`)
        } else {
          return gql(`query MyQuery {
                    medicines(where: {medicine_name: {name: {_eq: "${this.medicineNameInput}"}}}) {
                      medicine_name {
                        name
                        id
                      }
                      medicine_guide {
                        name
                      }
                      unit
                      medicine_name_id
                      maximum_dose
                      warning

                    }
                    medicine_names(where: {name: {_eq: "${this.medicineNameInput}"}}){
                      name
                    }
                  }`)
        }
      },

      update: (data) => {},
      result({ data }) {
        if (data.medicines[0]) {
          this.medicine_name_choose = data.medicines
          if (data.medicines[0].medicine_guide.name === null) {
            this.use_way = []
          } else {
            this.use_way = data.medicines[0].medicine_guide.name
          }
          if (data.medicines[0].maximum_dose === null) {
            this.maximum_dose = 0
          } else {
            this.maximum_dose = Number(data.medicines[0].maximum_dose)
          }
          this.str = data.medicines
          this.str_case = this.str[0].warning.split(';')
          // console.log(this.use_way)
          // console.log('liều limit: ' + this.maximum_dose)
        }
      },
    },

    // cắt chuỗi và popup
    warning_content: {
      query() {
        if (this.medicineNameInput === '') {
          this.medicine_name_choose = []
          return gql(`query MyQuery {
                        medicines(where: {medicine_name: {name: {_eq: "0"}}}) {
                          warning
                        }
                      }
                      `)
        } else {
          return gql(`query MyQuery {
                        medicines(where: {medicine_name: {name: {_eq: "${this.medicineNameInput}"}}}) {
                          warning
                        }
                      }`)
        }
      },

      update: (data) => {},
      result({ data }) {
        if (data) {
          if (data.medicines.str) {
            this.str = data.medicines
            // console.log('str: ' + this.str[0].warning)
            this.str_case = this.str[0].warning.split(';')
            // console.log('str_case: ' + this.str_case[0])
            // this.search_dianose = 'abc'
            // console.log('index: ' + this.search_dianose.search('a'))
          }
        }
      },
    },
    allergy_history_search: {
      query() {
        if (this.medicineNameInput === '') {
          this.medicine_name_choose = []
          return gql(`query MyQuery {
                        allergy_history(where: {medical_code: {_ilike: "0"}}) {
                          allergy_content
                          allergy_medicines
                        }
                      }

                      `)
        } else {
          return gql(`query MyQuery {
                        allergy_history(where: {medical_code: {_ilike: "${this.medical_code}"}}) {
                          allergy_content
                          allergy_medicines
                        }
                      }
                      `)
        }
      },

      update: (data) => {},
      result({ data }) {
        if (data) {
          this.allergy_warning = data.allergy_history
          // console.log('now: ' + this.allergy_warning)
          // console.log(
          //   'allergy_warning: ' +
          //     this.allergy_warning[0].alllergy_content +
          //     this.allergy_warning[1].alllergy_content
          // )
          // if (this.str) {
          //   this.all = this.str[0].warning.split(';')
          // }
          // console.log('str_case: ' + this.str_case[0])
          // this.search_dianose = 'abc'
          // console.log('index: ' + this.search_dianose.search('a'))
        }
      },
    },
    medicines_list: {
      query: gql(`query MyQuery {
                    medicines {
                      medicine_name {
                        name
                        id
                      }
                      unit
                      medicine_name_id
                    }
                    medicine_names{
                      id
                      name
                    }
                  }`),
      update: (data) => {},
      result({ data }) {
        this.medicines_list = data.medicines
        this.medicine_name = data.medicine_names
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
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? 'Thêm bệnh nhân'
        : 'Cập nhật thông tin bệnh nhân'
    },
  },
  nullEqZero() {
    if (this.amount_morning === '') return (this.amount_morning = 0)
  },

  // watch: {
  //   dialogDelete(val) {
  //     val || this.closeDelete()
  //   },
  // },
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
          .catch((response) => {
            // console.log(response)
          })
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
    test() {
      // console.log(this.medicineNameInput)
    },
    initialize() {
      this.patients = []
    },
    check_add() {
      // console.log(this.list_medicines_add)
      this.isInputNull = false
      if (this.receptionIdInput.trim() === '') {
        this.isInputNull = true
        this.title_popup_warning = 'Thông báo'
        this.content_popup_warning = 'Vui lòng nhập số phiếu bệnh nhân!'
        this.dialogWarning = true
        const input = document.getElementById('focusRecepInput')
        input.focus()
        return
      }
      if (!this.medicineNameInput) {
        this.isInputNull = true
        this.title_popup_warning = 'Thông báo'
        this.content_popup_warning = 'Vui lòng nhập thông tin thuốc!'
        this.dialogWarning = true
        return
      }
      const quantityPerMedi =
        this.amount_morning +
        this.amount_evening +
        this.amount_afternoon +
        this.amount_night
      // console.log('quantityPerMedi', quantityPerMedi)
      if (this.amount_day <= 0) {
        this.isInputNull = true
        this.title_popup_warning = 'Thông báo'
        this.content_popup_warning = 'Số ngày sử dụng thuốc phải >= 1'
        this.dialogWarning = true
        const input = document.getElementById('dayInput')
        input.focus()
        return
      }
      if (quantityPerMedi <= 0) {
        this.isInputNull = true
        this.title_popup_warning = 'Thông báo'
        this.content_popup_warning = 'Số lượng thuốc cho một ngày phải >= 1'
        this.dialogWarning = true
        const input = document.getElementById('morningInput')
        input.focus()
        return
      }
      const alreadyMedi = this.list_medicines_add.filter(
        (item) => item.name === this.medicine_name_choose[0].medicine_name.name
      )
      // console.log('alreadyMedi', alreadyMedi)
      if (alreadyMedi.length !== 0) {
        this.isInputNull = true
        this.title_popup_warning = 'Thông báo'
        this.content_popup_warning =
          'Thuốc ' +
          this.medicine_name_choose[0].medicine_name.name +
          ' đã có trong đơn'
        this.dialogWarning = true
        return
      }
      for (let i = 0; i < this.str_case.length; i++) {
        // Chống chỉ định:> 70 tuổi,< 12 tháng, Phụ nữ đang mang thai, dị ứng với Paracetamol 500mg,dị ứng với Phenytoin 100mg;
        // Xung khắc thuốc:Hapacol 650mg(tăng nguy cơ độc gan),Aspirin(tăng ức chế nhu động ruột);
        // Thận trọng:Đau dạ dày, Tai biến mạch máu não, Suy tim
        this.casename_content = this.str_case[i].split(':')
        // console.log('casename_content: ' + this.casename_content)
        this.casename_warning = this.casename_content[0]
        // console.log('casename_warning: ' + this.casename_warning)

        this.content_warning = this.casename_content[1].split(',')
        const content_warning = this.content_warning.map((element) => {
          element = element.trim()
          return element.toLowerCase()
        })

        // console.log('content_warning ', content_warning)
        for (let j = 0; j < content_warning.length; j++) {
          // TH1
          console.log('content_warning[j]', content_warning[j])
          // console.log('this.patient_age', content_warning[j] === '< 12 tháng')
          if (content_warning[j] === '> 70 tuổi') {
            if (this.patient_age > 70) {
              this.title_popup_warning = this.casename_warning
              this.content_popup_warning =
                'Thuốc không phù hợp với bệnh nhân trên 70 tuổi!'
              this.dialogWarning = true
              return
            }
          } else if (content_warning[j] === '< 12 tháng') {
            if (this.patient_age < 12) {
              this.title_popup_warning = this.casename_warning
              this.content_popup_warning =
                'Thuốc không phù hợp với bệnh nhân dưới 12 tháng tuổi!'
              this.dialogWarning = true
              return
            }
          }

          // have object_p
          if (this.object_patients) {
            // console.log('object_patients not null ', this.object_patients)
            const object_patients = this.object_patients.toLowerCase()
            const isObjWarning = content_warning.includes(object_patients)
            if (isObjWarning) {
              this.title_popup_warning = this.casename_warning
              this.content_popup_warning =
                'Thuốc không phù hợp với bệnh nhân ' + object_patients + '!'
              this.dialogWarning = true
            }
            return
          }

          // TH2
          if (this.allergy_warning && this.medicineNameInput) {
            // console.log('this.allergy_warning', this.allergy_warning)
            for (let i = 0; i < this.allergy_warning.length; i++) {
              this.allergy_medicine[i] = this.allergy_warning[
                i
              ].allergy_medicines
            }
            const allergy_content = this.allergy_medicine.filter((item) =>
              this.medicineNameInput.includes(item)
            )
            // console.log('allergy_warning:' + this.allergy_warning)
            // console.log('in here:' + this.allergy_medicine)
            // console.log('allergy_content:' + allergy_content)
            if (allergy_content.length !== 0) {
              this.title_popup_warning = 'Dị ứng thuốc'
              this.content_popup_warning =
                'Bệnh nhân đã từng dị ứng với thuốc ' +
                allergy_content.join(', ') +
                '!'
              this.dialogWarning = true
              return
            }
          }
          // TH3
          let diagnose = this.diagnose.split(',')
          diagnose = diagnose.map((element) => {
            element = element.toLowerCase()
            return element.trim()
          })
          const diUngChung = diagnose.filter((item) =>
            content_warning.includes(item)
          )
          if (diUngChung.length !== 0) {
            this.title_popup_warning = this.casename_warning
            this.content_popup_warning =
              'Thuốc không phù hợp với bệnh nhân ' + diUngChung.join(', ') + '!'
            this.dialogWarning = true
            return
          }
        }
        // console.log('content_warning: ' + this.content_warning)
        // console.log('casename_warning: ' + this.casename_warning)
      }
      // TH4
      if (
        this.amount_morning > this.maximum_dose ||
        this.amount_evening > this.maximum_dose ||
        this.amount_afternoon > this.maximum_dose ||
        this.amount_night > this.maximum_dose
      ) {
        this.title_popup_warning = 'Quá liều' // tạm cho vậy
        this.content_popup_warning =
          'Thuốc quá liều, liều dùng tối đa của ' +
          this.medicine_name_choose[0].medicine_name.name +
          ' cho một buổi là ' +
          this.maximum_dose // giá trị tạm
        // console.log('this.medicine_name_choose', this.medicine_name_choose)
        this.dialogWarning = true
      }
      if (
        this.title_popup_warning === '' &&
        this.content_popup_warning === ''
      ) {
        this.is_add_medicine = true
      }
      // console.log('title warning: ' + this.title_popup_warning)
      // console.log('content_popup: ' + this.content_popup_warning)
    },
    add() {
      const a = this.medicine_name_choose
      const total_quantity =
        this.amount_day *
        (this.amount_morning +
          this.amount_evening +
          this.amount_afternoon +
          this.amount_night)
      this.check_add()

      if (this.is_add_medicine) {
        this.is_add_medicine = false
        this.title_popup_warning = ''
        this.content_popup_warning = ''
        for (let i = 0; i < a.length; i++) {
          this.stt_medicine_list = this.stt_medicine_list + 1
          this.list_medicines_add.push({
            stt: this.stt_medicine_list,
            name: a[i].medicine_name.name,
            mor_num: this.amount_morning + ' ' + this.medicine_use,
            eve_num: this.amount_evening + ' ' + this.medicine_use,
            aft_num: this.amount_afternoon + ' ' + this.medicine_use,
            nig_num: this.amount_night + ' ' + this.medicine_use,
            total: total_quantity + ' ' + this.medicine_use,
            note: this.note_prescription,
            use_way: this.use_way,
          })
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
      return this.list_medicines_add.length
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
    // deletePatient(item) {
    //   this.editedIndex = this.patients.indexOf(item)
    //   this.editedItem = Object.assign({}, item)
    //   this.dialogDelete = true
    // },

    // close() {
    //   this.dialog = false
    //   this.dialogPatientDetail = false
    //   this.dialogPatientHiCard = false
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    //   })
    // },

    // closeDelete() {
    //   this.dialogDelete = false
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    //   })
    // },
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
    awaitDirect() {
      setTimeout(() => this.backToList(), 1500)
    },
    // adddepartmentFunction2() {
    //   this.department.plain_name = this.convertViToEn(this.department.name)
    //   const data_departments = {}

    //   data_departments.clinic_type_id = this.department.clinic_type_id
    //   data_departments.code = this.department.code
    //   data_departments.costcenter_id = this.department.costcenter_id
    //   data_departments.department_type_id = this.department.department_type.id
    //   data_departments.hrm = this.department.hrm
    //   data_departments.in_service = this.department.in_service
    //   data_departments.is_pause = this.department.is_pause
    //   data_departments.manager = this.department.manager
    //   data_departments.name = this.department.name
    //   data_departments.plain_name = this.department.plain_name
    //   data_departments.superior_id = this.department.department_parent.id
    //   data_departments.level = this.department.level
    //   data_departments.idx = this.department.idx

    //   data_departments.name_en = this.department.name_en
    //   data_departments.name_ru = this.department.name_ru
    //   data_departments.internal_hospital_id = this.department.internal_hospital.id

    //   console.log('data_departments', data_departments)
    //   const query = `mutation MyMutation($objects: [departments_insert_input!]!) {
    //         insert_departments(objects: $objects) {
    //           affected_rows
    //           returning {
    //             id
    //           }
    //         }
    //       }`
    //   console.log('query', query)
    //   this.$apollo.mutate({
    //     mutation: gql(query),
    //     variables: {
    //       objects: data_departments,
    //     },
    //     update: (store, { data: { insert_departments } }) => {
    //       if (insert_departments.affected_rows) {
    //         // eslint-disable-next-line
    //         this.textSnackbar = 'Thêm phòng ban thành công'
    //         this.snackbar = true
    //         this.awaitDirect()
    //       } else {
    //         this.textSnackbar = 'Thêm phòng ban thất bại'
    //         this.snackbar = true
    //       }
    //     },
    //   })
    // },
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
