<template>
  <v-form ref="form" v-model="isFormValid" lazy-validation>
    <v-toolbar flat>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="backToList()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Quay lại danh sách bệnh nhân </span>
      </v-tooltip>

      <v-toolbar-title v-if="isEdit" class="blue--text font-weight-bold">{{
        `Chỉnh sửa bệnh nhân: ${title_name}`
      }}</v-toolbar-title>
      <v-toolbar-title v-if="!isEdit" class="blue--text font-weight-bold">{{
        `Thêm bệnh nhân `
      }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        tile
        color="blue"
        :disabled="!isFormValid"
        @click="dialogSave = true"
      >
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
        <v-tabs background-color="blue" dark no-animation>
          <v-tab>thông tin bệnh nhân</v-tab>
          <v-tab>thông tin chi tiết</v-tab>
          <v-tab>BHYT</v-tab>
          <v-tab-item
            v-for="n in 3"
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
                <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                  <v-text-field
                    v-model="patient.medical_code"
                    outlined
                    dense
                    label="Mã y tế"
                    disabled
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                    <v-text-field
                      v-model="patient.hospital_code"
                      outlined
                      dense
                      label="Mã bệnh viện"
                      disabled
                    ></v-text-field>
                  </v-col> -->

                <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                  <v-text-field
                    v-model="patient.last_name"
                    outlined
                    dense
                    label="Họ"
                    class="required"
                    color="red"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" lg="3" xl="3" md="3">
                  <v-text-field
                    v-model="patient.middle_name"
                    outlined
                    dense
                    label="Tên đệm"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" lg="3" xl="3" md="3">
                  <v-text-field
                    v-model="patient.first_name"
                    outlined
                    dense
                    label="Tên"
                    class="required"
                    color="red"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                  <v-text-field
                    v-model="patient.phone_number"
                    outlined
                    class="required"
                    dense
                    label="Số điện thoại"
                    color="red"
                    :rules="[phoneNumberRule]"
                    maxlength="10"
                    :counter="10"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="patient.old_medical_code"
                  cols="12"
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                  style="margin-top: -20px"
                >
                  <v-text-field
                    v-model="patient.old_medical_code"
                    disabled
                    outlined
                    dense
                    label="Mã y tế cũ"
                  >
                  </v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                  style="margin-top: -20px"
                >
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
                        class="required"
                        color="red"
                        label="Ngày Sinh"
                        hint="Ngày-Tháng-Năm (vd: 15-02-1999)"
                        maxlength="10"
                        @blur="
                          patient.birthday = parseDate(
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
                      v-model="patient.birthday"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col
                  cols="12"
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                  style="margin-top: -20px"
                >
                  <v-autocomplete
                    v-model="patient.enum_gender"
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
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                >
                  <v-text-field
                    v-model="patient.email"
                    outlined
                    dense
                    label="email"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                >
                  <v-autocomplete
                    v-model="patient_info.country"
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
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                  style="margin-top: -20px"
                >
                  <v-text-field
                    v-model="patient_info.apartment_num"
                    outlined
                    dense
                    label="Địa chỉ cụ thể"
                    class="required"
                    color="red"
                    hint="Số nhà, tên tòa nhà, tên đường, tên khu vực"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                  style="margin-top: -20px"
                >
                  <v-autocomplete
                    v-model="patient_info.state"
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
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                  style="margin-top: -20px"
                >
                  <v-autocomplete
                    v-model="patient_info.district"
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
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                  style="margin-top: -20px"
                >
                  <v-autocomplete
                    v-model="patient_info.ward"
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
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                  style="margin-top: -30px"
                >
                  <v-checkbox
                    v-model="isHaveIdCard"
                    label="Có CMND/Passport"
                    hide-details
                  ></v-checkbox>
                </v-col>

                <v-col
                  v-if="isHaveIdCard"
                  cols="12"
                  style="margin-top: -20px"
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                >
                  <v-text-field
                    v-model="patient.id_card_no"
                    outlined
                    dense
                    :counter="12"
                    class="required"
                    color="red"
                    maxlength="12"
                    :rules="[cmndRule]"
                    label="CMND/Passport"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="isHaveIdCard"
                  cols="12"
                  sm="2"
                  lg="2"
                  xl="2"
                  md="2"
                  style="margin-top: -20px"
                >
                  <v-menu
                    v-model="menu_id_card_issue_date"
                    :close-on-content-click="false"
                    :nudge-right="100"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateFormattedid_card_issue_date"
                        outlined
                        dense
                        label="Ngày cấp"
                        hint="Ngày-Tháng-Năm (vd: 15-02-1999)"
                        maxlength="10"
                        @blur="
                          patient.id_card_issue_date = parseDate(
                            dateFormattedid_card_issue_date,
                            'id_card_issue_date'
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
                      v-model="patient.id_card_issue_date"
                      @input="menu_id_card_issue_date = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col
                  v-if="isHaveIdCard"
                  cols="12"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                  style="margin-top: -20px"
                >
                  <v-text-field
                    v-model="patient.id_card_issue_place"
                    outlined
                    dense
                    label="Nơi cấp "
                  ></v-text-field>
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
                  <p
                    class="text-decoration-none font-weight-medium blue--text text--darken-4"
                  >
                    THÔNG TIN LIÊN LẠC
                    <v-btn
                      elevation="1"
                      fab
                      small
                      class="ml-3"
                      @click="addMoreFamilyPatient()"
                    >
                      <v-icon>mdi-home-plus-outline</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="
                        patient.patient_contacts.length > 0 &&
                        patient.patient_contacts.length < 2
                      "
                      elevation="1"
                      fab
                      small
                      class="ml-3"
                      @click="deleteFamilyPatient(0)"
                    >
                      <v-icon>mdi-home-minus-outline</v-icon>
                    </v-btn>
                  </p>
                </v-col>
                <v-row
                  v-for="(patient_contact, i) in patient.patient_contacts"
                  :key="i"
                  class="pl-4 pr-4"
                >
                  <v-col
                    cols="12"
                    sm="12"
                    lg="12"
                    xl="12"
                    md="12"
                    style="margin-top: -20px"
                    class="pl-10"
                  >
                    <p
                      class="text-decoration-none font-weight-medium indigo--text text--accent-4"
                    >
                      {{ `--Người nhà ${i + 1}` }}
                      <v-btn
                        v-if="i > 0"
                        elevation="1"
                        fab
                        small
                        class="ml-3"
                        @click="deleteFamilyPatient(i)"
                      >
                        <v-icon>mdi-home-minus-outline</v-icon>
                      </v-btn>
                    </p>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    lg="4"
                    xl="4"
                    md="4"
                    style="margin-top: -30px"
                  >
                    <v-text-field
                      v-model="patient_contact.fullname_contact"
                      outlined
                      dense
                      label="Tên người nhà"
                      class="required"
                      color="red"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="2"
                    lg="2"
                    xl="2"
                    md="2"
                    style="margin-top: -30px"
                  >
                    <v-autocomplete
                      v-model="patient_contact.enum_gender"
                      label="Giới tính"
                      :items="genderList"
                      item-text="name"
                      item-value="code"
                      return-object
                      outlined
                      dense
                      class="required"
                      color="red"
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="2"
                    lg="2"
                    xl="2"
                    md="2"
                    style="margin-top: -30px"
                  >
                    <v-text-field
                      v-model="patient_contact.phone_contact"
                      outlined
                      :counter="10"
                      dense
                      :rules="[phoneNumberRule]"
                      maxlength="10"
                      class="required"
                      color="red"
                      label="Số điện thoại người nhà"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="2"
                    lg="2"
                    xl="2"
                    md="2"
                    style="margin-top: -30px"
                  >
                    <v-text-field
                      v-model="patient_contact.email_contact"
                      outlined
                      dense
                      label="Email người nhà"
                      :rules="emailRules"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="4"
                    lg="4"
                    xl="4"
                    md="4"
                    style="margin-top: -30px"
                  >
                    <v-text-field
                      v-model="patient_contact.address_contact"
                      outlined
                      dense
                      class="required"
                      color="red"
                      label="Địa chỉ người nhà"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="2"
                    lg="2"
                    xl="2"
                    md="2"
                    style="margin-top: -30px"
                  >
                    <v-autocomplete
                      v-model="patient_contact.state"
                      label="Tỉnh/Thành phố"
                      :items="patient_contact.contact_states"
                      item-text="name"
                      item-value="id"
                      clearable
                      return-object
                      outlined
                      dense
                      class="required"
                      color="red"
                      @change="handleChangeContactState(patient_contact)"
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="2"
                    lg="2"
                    xl="2"
                    md="2"
                    style="margin-top: -30px"
                  >
                    <v-autocomplete
                      v-model="patient_contact.district"
                      label="Quận/Huyện/TP trực thuộc"
                      :items="patient_contact.contact_districts"
                      item-text="name"
                      item-value="id"
                      clearable
                      return-object
                      outlined
                      dense
                      class="required"
                      color="red"
                      @change="handleChangeContactDistrict(patient_contact)"
                    ></v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="2"
                    lg="2"
                    xl="2"
                    md="2"
                    style="margin-top: -30px"
                  >
                    <v-autocomplete
                      v-model="patient_contact.ward"
                      :items="patient_contact.contact_wards"
                      item-text="name"
                      item-value="id"
                      clearable
                      return-object
                      outlined
                      dense
                      class="required"
                      color="red"
                      label="Phường/Xã"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <!-- <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="6"
                    lg="6"
                    xl="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="patient.passport_no"
                      outlined
                      dense
                      label="Mã passport"
                    ></v-text-field>
                  </v-col> -->

                <!-- <v-col cols="12" style="margin-top: -20px" sm="12" md="12">
                    <v-text-field
                      v-model="patient.address"
                      outlined
                      dense
                      label="Địa chỉ"
                      disabled
                    ></v-text-field>
                  </v-col> -->
              </v-row>
              <v-row v-if="n == 2" style="background-color: white">
                <!-- <v-col cols="12"  style="margin-top: -20px"sm="6" md="4 ">
                    <v-radio-group v-model="patient_info.hashicard" row>
                      <template #label>
                        <div>Có thẻ y tế</div>
                      </template>
                      <v-radio class="ml-10" label="Có" :value="true"></v-radio>
                      <v-radio
                        class="ml-10"
                        label="Không có"
                        :value="false"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12"  style="margin-top: -20px"sm="4"
                  lg="4"
                  xl="4"
                  md="4">
                    <v-text-field
                      v-if="patient_info.hashicard === true"
                      v-model="patient_hicard.hi_number"
                      outlined
                      dense
                      label="Mã thẻ y tế"
                    ></v-text-field>
                  </v-col> -->

                <!-- <v-col cols="12"  style="margin-top: -20px"sm="4"
                  lg="4"
                  xl="4"
                  md="4"> </v-col> -->
                <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                  <v-autocomplete
                    v-model="patient_info.ethnic_group"
                    label="Dân tộc"
                    :items="ethnicGroups"
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
                    v-model="patient_info.blood_group"
                    label="Nhóm máu"
                    :items="blood_groups"
                    item-text="code"
                    item-value="id"
                    return-object
                    outlined
                    dense
                    clearable
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="4" lg="4" xl="4" md="4">
                  <v-autocomplete
                    v-model="patient_info.career"
                    label="Nghề nghiệp"
                    :items="careers"
                    item-text="name"
                    item-value="id"
                    return-object
                    outlined
                    dense
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
                      v-model="patient_info.rh_factor_id"
                      outlined
                      dense
                      label="Yếu tố Rh"
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
                      v-model="patient_info.outpatient_number"
                      outlined
                      dense
                      label="Số lưu trữ ngoại trú"
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
                      v-model="patient_info.inpatient_number"
                      outlined
                      dense
                      label="Số lưu trữ nội trú"
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
                      v-model="patient_info.employee"
                      label="Nhân viên"
                      :items="employees"
                      item-text="fullname"
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
                    <v-text-field
                      v-model="patient_info.anamnesis"
                      outlined
                      dense
                      label="Bệnh sử"
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
                      v-model="patient_info.smoking_history"
                      outlined
                      dense
                      label="Tiền sử hút thuốc lá"
                    ></v-text-field>
                  </v-col> -->

                <v-col cols="12" sm="4" lg="4" xl="4" md="4">
                  <v-autocomplete
                    v-model="patient_info.work_unit"
                    label="Đơn vị công tác"
                    :items="workUnits"
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
                      v-model="patient_info.permanent_address"
                      outlined
                      dense
                      label="Địa chỉ thường trú"
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
                      v-model="patient_info.contact_address"
                      outlined
                      dense
                      label="Địa chỉ liên lạc"
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
                    v-model="patient_info.work_address"
                    outlined
                    dense
                    label="Địa chỉ cơ quan"
                  ></v-text-field>
                </v-col>

                <!-- <v-col cols="12"  style="margin-top: -20px"sm="4"
                  lg="4"
                  xl="4"
                  md="4">
                    <v-text-field
                      v-model.number="patient_info.ordinal"
                      outlined
                      dense
                      label="STT"
                    ></v-text-field>
                  </v-col> -->

                <!-- <v-col cols="12"  style="margin-top: -20px"sm="2"
                  lg="2"
                  xl="2"
                  md="2">
                    <v-text-field outlined
              dense
                      v-model="patient_info.image_source"
                      label="Hình ảnh"
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
                      v-model.number="patient_info.patient_type"
                      outlined
                      dense
                      label="Loại bệnh nhân"
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
                      v-model="patient_info.staff_code"
                      outlined
                      dense
                      label="Mã nhân viên"
                    ></v-text-field>
                  </v-col> -->

                <!-- <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="3"
                    lg="3"
                    xl="3"
                    md="3"
                  >
                    <v-checkbox
                      v-model="patient_info.isMarried"
                      :label="`Lập gia đình`"
                    ></v-checkbox>
                  </v-col>

                  <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="3"
                    lg="3"
                    xl="3"
                    md="3"
                  >
                    <v-checkbox
                      v-model="patient_info.is_overseas"
                      :label="`Việt kiều`"
                    ></v-checkbox>
                  </v-col> -->

                <v-col
                  cols="12"
                  style="margin-top: -20px"
                  sm="3"
                  lg="3"
                  xl="3"
                  md="3"
                >
                  <v-checkbox
                    v-model="patient_info.is_foreigner"
                    :label="`Người nước ngoài`"
                  ></v-checkbox>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  lg="12"
                  xl="12"
                  md="12"
                  style="margin-top: -20px"
                >
                  <v-textarea
                    v-model="patient.note"
                    label="Ghi chú"
                    outlined
                    dense
                    rows="1"
                    auto-grow
                  ></v-textarea>
                </v-col>
                <!-- <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="3"
                    lg="3"
                    xl="3"
                    md="3"
                  >
                    <v-checkbox
                      v-model="patient_info.isDeath"
                      :label="`Tử vong`"
                    ></v-checkbox>
                  </v-col> -->

                <!-- <v-col
                    v-if="patient_info.isDeath === true"
                    cols="12"
                    sm="4"
                    lg="4"
                    xl="4"
                    md="4"
                  >
                    <v-autocomplete
                      v-model="patient_info.death_confirm_staff"
                      label="Người ghi nhận tử vong"
                      :items="employees"
                      item-text="fullname"
                      item-value="id"
                      return-object
                      outlined
                      dense
                    ></v-autocomplete>
                  </v-col>

                  <v-col
                    v-if="patient_info.isDeath === true"
                    cols="12"
                    sm="4"
                    lg="4"
                    xl="4"
                    md="4"
                  >
                    <v-autocomplete
                      v-model="patient_info.cause_of_death"
                      label="Nguyên nhân tử vong"
                      :items="cause_of_deaths"
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
                    sm="2"
                    lg="2"
                    xl="2"
                    md="2"
                    v-if="patient_info.isDeath === true"
                  >
                    <v-menu
                      v-model="menuDateDeath"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="patient.patient_info_date_death"
                          outlined
                          dense
                          label="Ngày mất"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="patient.patient_info_date_death"
                        @input="menuDateDeath = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="2"
                    lg="2"
                    xl="2"
                    md="2"
                    v-if="patient_info.isDeath === true"
                  >
                    <v-menu
                      ref="menu"
                      v-model="menuTimeDeath"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value="patient.patient_info_time_death"
                      transition="scale-transition"
                      offset-y
                      max-width="400px"
                      min-width="400px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="patient.patient_info_time_death"
                          outlined
                          dense
                          label="Thời gian mất"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuTimeDeath"
                        v-model="patient.patient_info_time_death"
                        full-width
                        use-seconds
                        @click:second="
                          $refs.menu.save(patient.patient_info_time_death)
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col> -->
              </v-row>
              <v-row v-if="n == 3" style="background-color: white">
                <!-- <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                    <v-text-field
                      v-model="patient_hicard.hi_number"
                      outlined
                      dense
                      label="Mã thẻ y tế"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12"  style="margin-top: -20px"sm="6"
                  lg="6"
                  xl="6"
                  md="6">
                    <v-text-field
                      v-model.number="patient_hicard.hi_type"
                      outlined
                      dense
                      label="Loại thẻ y tế"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="2" lg="2" xl="2" md="2">
                    <v-menu
                      v-model="menuHiCard_issued_date"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="patient_hicard.hicard_issued_date"
                          outlined
                          dense
                          label="Ngày cấp thẻ"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="patient_hicard.hicard_issued_date"
                        @input="menuHiCard_issued_date = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="6"
                    lg="6"
                    xl="6"
                    md="6"
                  >
                    <v-menu
                      ref="menu"
                      v-model="menuHiCard_issued_time"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      ::return-value="patient.patient_hicards_issued_time"
                      transition="scale-transition"
                      offset-y
                      max-width="400px"
                      min-width="400px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="patient.patient_hicards_issued_time"
                          outlined
                          dense
                          label="Thời gian cấp thẻ"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuHiCard_issued_time"
                        v-model="patient.patient_hicards_issued_time"
                        full-width
                        use-seconds
                        @click:second="
                          $refs.menu.save(patient.patient_hicards_issued_time)
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="6"
                    lg="6"
                    xl="6"
                    md="6"
                  >
                    <v-menu
                      v-model="menuHiCard_datefrom"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="patient.patient_hicards_date_from"
                          outlined
                          dense
                          label="Ngày bắt đầu"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="patient.patient_hicards_date_from"
                        @input="menuHiCard_datefrom = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="6"
                    lg="6"
                    xl="6"
                    md="6"
                  >
                    <v-menu
                      ref="menu"
                      v-model="menuHiCard_timefrom"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value="patient.patient_hicards_time_from"
                      transition="scale-transition"
                      offset-y
                      max-width="400px"
                      min-width="400px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="patient.patient_hicards_time_from"
                          outlined
                          dense
                          label="Thời gian bắt dầu"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuHiCard_timefrom"
                        v-model="patient.patient_hicards_time_from"
                        full-width
                        use-seconds
                        @click:second="
                          $refs.menu.save(patient.patient_hicards_time_from)
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="6"
                    lg="6"
                    xl="6"
                    md="6"
                  >
                    <v-menu
                      v-model="menuHiCard_dateto"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="patient.patient_hicards_date_to"
                          outlined
                          dense
                          label="Ngày hết hạn"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="patient.patient_hicards_date_to"
                        @input="menuHiCard_dateto = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="12"
                    style="margin-top: -20px"
                    sm="6"
                    lg="6"
                    xl="6"
                    md="6"
                  >
                    <v-menu
                      ref="menu"
                      v-model="menuHiCard_timeto"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      ::return-value="patient.patient_hicards_time_to"
                      transition="scale-transition"
                      offset-y
                      max-width="400px"
                      min-width="400px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="patient.patient_hicards_time_to"
                          outlined
                          dense
                          label="Thời gian hết hạn"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuHiCard_timeto"
                        v-model="patient.patient_hicards_time_to"
                        full-width
                        use-seconds
                        @click:second="
                          $refs.menu.save(patient.patient_hicards_time_to)
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>

                   -->

                <v-col cols="12" sm="9" lg="9" xl="9" md="9">
                  <v-text-field
                    v-model="patient_hicard.hi_number"
                    outlined
                    dense
                    label="Mã BHYT"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="3" lg="3" xl="3" md="3">
                  <v-text-field
                    v-model.number="patient_hicard.hi_type"
                    outlined
                    dense
                    label="Mã hưởng"
                  ></v-text-field>
                </v-col>

                <!-- <v-col
                  
                  cols="12"
                  sm="4"
                  lg="4"
                  xl="4"
                  md="4"
                  style="margin-top: -20px"
                  class="ml-n5 col-MaBHYT2"
                >
                  <v-text-field
                    v-model="hi_number_string_2"
                    outlined
                    dense
                  ></v-text-field>
                </v-col> -->

                <!-- <v-col
                  
                  cols="12"
                  sm="4" lg="4" xl="4"
                  md="4"
                  style="margin-top: -20px"
                >
                  <v-text-field
                    v-model.number="patient_hicard.hi_type"
                    outlined
                    dense
                    label="Loại BHYT"
                  ></v-text-field>
                </v-col> -->

                <v-col
                  cols="12"
                  sm="6"
                  lg="6"
                  xl="6"
                  md="6"
                  style="margin-top: -20px"
                >
                  <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="100"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateHiDateFromFormatted"
                        outlined
                        dense
                        label="Từ ngày"
                        hint="Ngày-Tháng-Năm (vd: 15-02-1999)"
                        maxlength="10"
                        @blur="
                          patient_hicard.hi_datefrom = parseDate(
                            dateHiDateFromFormatted,
                            'hifrom'
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
                      v-model="patient_hicard.hi_datefrom"
                      @input="menu1 = false"
                    ></v-date-picker>
                  </v-menu>
                  <!-- <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="100"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          :value="getDisplayValue(patient_hicard.hi_datefrom)"
                          outlined
                          dense
                          label="Từ ngày"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="patient_hicard.hi_datefrom"
                        @input="menu1 = false"
                      ></v-date-picker>
                    </v-menu> -->
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  lg="6"
                  xl="6"
                  md="6"
                  style="margin-top: -20px"
                >
                  <v-autocomplete
                    v-model="patient_hicard.hospital_kcb"
                    label="Nơi đăng kí"
                    :items="hospitals"
                    item-text="name"
                    item-value="code"
                    :filter="customFilter"
                    return-object
                    outlined
                    dense
                    clearable
                  ></v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  lg="6"
                  xl="6"
                  md="6"
                  style="margin-top: -20px"
                >
                  <v-menu
                    v-model="menu3"
                    :close-on-content-click="false"
                    :nudge-right="100"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateHiDateToFormatted"
                        outlined
                        dense
                        label="Đến ngày"
                        hint="Ngày-Tháng-Năm (vd: 15-02-1999)"
                        maxlength="10"
                        @blur="
                          patient_hicard.hi_dateto = parseDate(
                            dateHiDateToFormatted,
                            'hito'
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
                      v-model="patient_hicard.hi_dateto"
                      @input="menu3 = false"
                    ></v-date-picker>
                  </v-menu>
                  <!-- <v-menu
                      v-model="menu3"
                      :close-on-content-click="false"
                      :nudge-right="-300"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          :value="getDisplayValue(patient_hicard.hi_dateto)"
                          outlined
                          dense
                          label="Đến ngày"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="patient_hicard.hi_dateto"
                        @input="menu3 = false"
                      ></v-date-picker>
                    </v-menu> -->
                </v-col>
                <v-col
                  cols="12"
                  style="margin-top: -30px"
                  sm="6"
                  lg="6"
                  xl="6"
                  md="6"
                >
                  <v-checkbox
                    v-model="patient_hicard.is_active"
                    :label="`Còn thời hạn`"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs>
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
import firebase from 'firebase'
import gql from 'graphql-tag'
import moment from 'moment-timezone'
// import Datatable from '~/components/core/Datatable'
// $rh_factor_id: Int
// $smoking_history: String
// $staff_code: String
// $patient_type: Int
// $outpatient_number: String
// $ordinal: Int
// $is_overseas: Boolean
// $isMarried: Boolean
// $isDeath: Boolean
// $inpatient_number: String
// $image_source: String
// $anamnesis: String
// $allergy: String
// $cause_of_death_id: Int
// $employee_id: Int
// $death_date: timestamptz
// $death_confirm_staff_id: Int
// update_patient_info(
//       where: { patient_id: { _eq: $id } }
//       _set: {
//         hicard_id: $hicard_id
//         allergy: $allergy
//         apartment_num: $apartment_num
//         anamnesis: $anamnesis
//         blood_group_id: $blood_group_id
//         career_id: $career_id
//         country_id: $country_id
//         death_confirm_staff_id: $death_confirm_staff_id
//         death_date: $death_date
//         district_id: $district_id
//         employee_id: $employee_id
//         hashicard: $hashicard
//         image_source: $image_source
//         inpatient_number: $inpatient_number
//         isDeath: $isDeath
//         isMarried: $isMarried
//         is_foreigner: $is_foreigner
//         ethnic_group_id: $ethnic_group_id
//         is_overseas: $is_overseas
//         outpatient_number: $outpatient_number
//         ordinal: $ordinal
//         permanent_address: $permanent_address
//         patient_type: $patient_type
//         plain_name: $plain_name
//         smoking_history: $smoking_history
//         staff_code: $staff_code
//         state_id: $state_id
//         ward_id: $ward_id
//         work_address: $work_address
//         work_unit_id: $work_unit_id
//         rh_factor_id: $rh_factor_id
//         cause_of_death_id: $cause_of_death_id
//         contact_address: $contact_address
//       }
//     ) {
//       affected_rows
//     }

export default {
  asyncData({ route, params }) {
    let temp = null
    if (route.query.id != null && route.query.id !== undefined) {
      temp = route.query.id
    }
    let isEdit = false
    if (temp !== null && temp !== '0') {
      isEdit = true
    }
    if (temp !== null) {
      const objId = `"${temp}"`
      return { objId, isEdit }
    } else {
      const objId = null
      console.log('objetasdasdas ' + objId)
      return { objId, isEdit }
    }
  },
  data: (vm) => ({
    dateFormatted: null,
    dateHiDateFromFormatted: null,
    dateHiDateToFormatted: null,
    snackbar: false,
    dialogSave: false,
    blood_groups: [],
    textSnackbar: '',
    isEdit: true,
    isFormValid: false,
    dateFormattedid_card_issue_date: null,
    menu_id_card_issue_date: false,
    hourTimeDeath: false,
    minuteTimeDeath: false,
    secondTimeDeath: false,
    title_name: '',
    menu2: false,
    menu3: false,
    menu1: false,
    menuDateDeath: false,
    menuTimeDeath: false,
    dialog: false,
    dialogPatientDetail: false,
    dialogDelete: false,
    cmndRule: (v) => {
      if (v) {
        if (/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/.test(v)) {
          if (/^[A-Za]+$/.test(v[0])) {
            if (v.length === 8 && /^[A-Za][0-9]{7}$/.test(v)) {
              return true
            } else {
              return 'passport phải đúng định dạng, vd:C1234567'
            }
          } else if (/^[z0-9]+$/.test(v[0])) {
            if (v.length > 8) {
              return true
            } else {
              return 'CMND phải có 9 số(cũ) hoặc 12(mới)'
            }
          }
        } else {
          return 'Không được có khoảng trắng đầu và cuối'
        }
      }
    },
    phoneNumberRule: (v) => {
      if (v) {
        if (/^[Z0-9-()]+(\s+[Z0-9-()]+)*$/.test(v)) {
          if (v[0] === '0' && v.length === 10) {
            return true
          }
          return 'sdt phải có 10 số. Vd: 0701234567'
        } else {
          return 'Không được có khoảng trắng và kí tự'
        }
      }
      // if (!v.trim()) return true
      // if (
      //   v[0] === '0' &&
      //   v.length === 10 &&
      //   !isNaN(parseFloat(v)) &&
      //   v >= 0 &&
      //   v <= 1000000000
      // ) {
      //   return true
      // }
      // return 'vd: 0701234567'
    },
    emailRules: [
      (v) =>
        !v ||
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(v) ||
        'email phải đúng định dạng. vd: nvmau@gmail.com',
    ],
    genderList: [],
    user: {},
    permission: {},
    dialogPatientHiCard: false,
    menuHiCard_issued_date: false,
    menuHiCard_issued_time: false,
    menuHiCard_datefrom: false,
    menuHiCard_timefrom: false,
    menuHiCard_dateto: false,
    menuHiCard_timeto: false,

    GioiTinh: ['Nam', 'Nữ'],
    boolContactAddressDetail: false,
    hospitals: [],
    patients: [],
    countries: [],
    states: [],
    districts: [],
    wards: [],
    workUnits: [],
    careers: [],
    ethnicGroups: [],
    employees: [],
    contact_wards: [],
    contact_states: [],
    contact_districts: [],
    cause_of_deaths: [],
    isHaveIdCard: false,
    patient: {
      old_medical_code: '',
      id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      enum_gender: {
        code: 'male',
        name: 'Nam',
      },
      email: '',
      hospital_code: '701HHL',
      id_card_no: '',
      birthday: '',
      phone_number: '',
      id_card_issue_date: null,
      id_card_issue_place:
        'CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI',

      medical_code: '',
      passport_no: '',
      address: '',
      note: '',
      fullname: '',
      patient_contacts: [
        // {
        //   contact_states: [],
        //   contact_districts: [],
        //   contact_wards: [],
        //   enum_gender: {
        //     code: null,
        //     name: null,
        //   },
        //   fullname: null,
        //   phone: null,
        //   email: null,
        //   address: null,
        //   state: { id: null, name: null, contact_districts: [] },
        //   district: { id: null, name: null, contact_wards: [] },
        //   ward: { id: null, name: null },
        // },
      ],
      patient_infos: [],
      // patient_info: [],
      patient_info_date_death: null,
      patient_info_time_death: null,

      patient_hicards: [],
      // patient_hicard: [],
      patient_hicards_issued_time: null,
      patient_hicards_date_from: null,
      patient_hicards_date_to: null,
      patient_hicards_time_from: null,
      patient_hicards_time_to: null,

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
      medical_examination_reexaminations: [],
    },
    patient_info: {
      hashicard: false,
      hicard_id: null,
      apartment_num: '',
      plain_name: null,
      blood_group_id: null,
      rh_factor_id: null,
      allergy: null,
      outpatient_number: null,
      inpatient_number: null,
      is_overseas: false,
      is_foreigner: false,
      anamnesis: null,
      smoking_history: null,

      permanent_address: null,
      contact_address: null,
      work_address: null,
      isDeath: false,
      death_date: null,
      ordinal: null,
      isMarried: false,
      image_source: null,
      patient_type: null,
      staff_code: null,
      patient_id: null,

      work_unit_id: 1,
      country_id: 1,
      state_id: 1,
      district_id: 1,
      ward_id: 1,
      ethnic_group_id: 1,
      career_id: 1,
      employee_id: 1,
      death_confirm_staff_id: 1,
      cause_of_death_id: 1,

      blood_group: { id: null, code: null, name: null },
      work_unit: { id: null, name: null },
      state: { id: null, name: null },
      district: { id: null, name: null },
      ward: { id: null, name: null },
      country: { id: null, name: null },
      ethnic_group: { id: null, name: null },
      career: { id: null, name: null },
      employee: { id: null, fullname: null },
      death_confirm_staff: { id: null, fullname: null },
      cause_of_death: { id: null, name: null },
    },
    patient_hicard: {
      hi_number_string_1: '',
      hi_number_string_2: '',
      hicard_issued_date: null,
      hicard_issued_time: null,
      hi_number: null,
      hi_datefrom: null,
      hi_dateto: null,
      hi_type: null,
      is_active: false,
      patient_id: null,
      hospital_kcb_id: null,
      hospital_kcb: { id: null, name: null },
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
    // ethnicGroups: {
    //   query: gql(`query MyQuery {
    //     ethnic_groups {
    //       id
    //       name

    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.ethnicGroups = data.ethnic_groups
    //   },
    // },
    // workUnits: {
    //   query: gql(`query MyQuery {
    //     work_units {
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
    //     countries {
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
    //     states {
    //       id
    //       name

    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.states = data.states
    //   },
    // },
    // districts: {
    //   query: gql(`query MyQuery {
    //     districts {
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
    //     wards {
    //       id
    //       name

    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.wards = data.wards
    //   },
    // },
    // employees: {
    //   query: gql(`query MyQuery {
    //     employees(where:  {type: {_eq: "BS"}}) {
    //       id
    //       fullname
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.employees = data.employees
    //   },
    // },
    // cause_of_deaths: {
    //   query: gql(`query MyQuery {
    //     cause_of_deaths {
    //       id
    //       name
    //     }
    //   }`),
    //   update: (data) => {},
    //   result({ data }) {
    //     this.cause_of_deaths = data.cause_of_deaths
    //   },
    // },
    patients: {
      query() {
        let queryTemp = ''
        if (this.objId !== null) {
          queryTemp = `patients(where: {id: {_eq: ${this.objId}}}) {
          patient_contacts{
enum_gender{
                code
                name
              }
                fullname_contact
                email_contact
                phone_contact
                address_contact
                district {
                  name
                  id
                  state_id
                  wards {
                    id
                    name
                    district_id
                  }
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
                ward {
                  name
                  id
                  district_id
                }
              }
            fullname
            first_name
            middle_name
            last_name
            gender
            enum_gender{
                code
                name
              }
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
            id_card_issue_date
            id_card_issue_place

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
              blood_group {
                id
                name
                code
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
              district {
                  name
                  id
                  state_id
                  wards {
                    id
                    name
                    district_id
                  }
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
                ward {
                  name
                  id
                  district_id
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
              hospital_kcb_id
              hospital_kcb {
                id
                name
                code
              }
            }
        }`
        }
        const query = gql(`query MyQuery {
          careers(order_by: {updated_at: desc}) {
          code
          id
          name
          plain_name
        }
         enum_gender{
          code
          name
        }
         hospitals(order_by: {updated_at: desc}) {
          id
          name
          code
        }
        blood_groups(order_by: {updated_at: desc}){
          id
          code
          name
        }
        ethnic_groups(order_by: {updated_at: desc}) {
          id
          name

        }
        work_units(order_by: {updated_at: desc}) {
          id
          name

        }
        countries(order_by: {updated_at: desc}){
          id
          name

        }
        states(order_by: {updated_at: desc}) {
          id
          name
          districts(order_by: {updated_at: desc}) {
            id
            name
            state_id
            wards(order_by: {updated_at: desc})  {
              id
              name
              district_id
            }
          }
        }
        districts {
          id
          name

        }
        wards {
          id
          name

        }
           employees(order_by: {updated_at: desc}) {
          id
          fullname
        }
        cause_of_deaths(order_by: {updated_at: desc}) {
          id
          name
        }
        ${queryTemp}
      }`)
        return query
      },

      result({ data }) {
        this.careers = data.careers
        this.countries = data.countries
        this.states = data.states
        this.districts = data.districts
        this.wards = data.wards
        this.hospitals = data.hospitals
        this.genderList = data.enum_gender
        this.workUnits = data.work_units
        this.ethnicGroups = data.ethnic_groups
        this.contact_states = data.states
        this.blood_groups = data.blood_groups
        this.employees = data.employees
        this.cause_of_deaths = data.cause_of_deaths
        if (data !== undefined && data !== null && data.patients) {
          this.patient = data.patients[0]
          this.patient_info = data.patients[0].patient_infos[0]
          this.patient_hicard = data.patients[0].patient_hicards[0]
          this.title_name = this.patient.fullname
          if (
            this.patient.id_card_no !== '' &&
            this.patient.id_card_no !== null
          ) {
            this.isHaveIdCard = true
          }
          if (this.patient_info.death_date !== null) {
            this.timeString = this.patient_info.death_date.split('T')
            this.patient.patient_info_date_death = this.timeString[0]
            this.timeString = this.timeString[1].split('+')
            this.patient.patient_info_time_death = this.timeString[0]
          } else {
            this.patient.patient_info_date_death = null
            this.patient.patient_info_time_death = null
          }

          if (this.patient_info.state === null) {
            this.patient_info.state = { id: null, name: null }
          } else {
            this.districts = this.patient_info.state.districts
            if (this.patient_info.district === null) {
              this.patient_info.district = { id: null, name: null }
            } else {
              for (
                let indexDistrict = 0;
                indexDistrict < this.districts.length;
                indexDistrict++
              ) {
                if (
                  this.patient_info.district.id ===
                  this.districts[indexDistrict].id
                ) {
                  this.wards = this.districts[indexDistrict].wards
                }
              }
            }
          }

          // if (this.patient_hicard.hicard_issued_time !== null) {
          //   this.timeString = this.patient_hicard.hicard_issued_time.split('T')
          //   this.timeString = this.timeString[1].split('+')
          //   this.patient.patient_hicards_issued_time = this.timeString[0]
          // } else {
          //   this.patient.patient_hicards_issued_time = null
          // }

          // if (this.patient_hicard.hi_datefrom !== null) {
          //   this.timeString = this.patient_hicard.hi_datefrom.split('T')
          //   this.patient.patient_hicards_date_from = this.timeString[0]
          //   this.timeString = this.timeString[1].split('+')
          //   this.patient.patient_hicards_time_from = this.timeString[0]
          // } else {
          //   this.patient.patient_hicards_time_from = null
          // }

          // if (this.patient_hicard.hi_dateto !== null) {
          //   this.timeString = this.patient_hicard.hi_dateto.split('T')
          //   this.patient.patient_hicards_date_to = this.timeString[0]
          //   this.timeString = this.timeString[1].split('+')
          //   this.patient.patient_hicards_time_to = this.timeString[0]
          // } else {
          //   this.patient.patient_hicards_time_to = null
          // }
          // if (this.patient_hicard.hi_dateto !== null) {
          //   this.timeString = this.patient_hicard.hi_dateto.split('T')
          //   this.patient.patient_hicards_date_to = this.timeString[0]
          //   this.timeString = this.timeString[1].split('+')
          //   this.patient.patient_hicards_time_to = this.timeString[0]
          // } else {
          //   this.patient.patient_hicards_time_to = null
          // }
          if (this.patient_hicard.hospital_kcb === null) {
            this.patient_hicard.hospital_kcb = { id: null, name: null }
          }
          if (this.patient_info.work_unit === null) {
            this.patient_info.work_unit = { id: null, name: null }
          }
          if (this.patient_info.country === null) {
            this.patient_info.country = { id: null, name: null }
          }
          if (this.patient_info.state === null) {
            this.patient_info.state = { id: null, name: null }
          }
          if (this.patient_info.district === null) {
            this.patient_info.district = { id: null, name: null }
          }
          if (this.patient_info.blood_group === null) {
            this.patient_info.blood_group = { id: null, code: null, name: null }
          }
          if (this.patient_info.ward === null) {
            this.patient_info.ward = { id: null, name: null }
          }
          if (this.patient_info.ethnic_group === null) {
            this.patient_info.ethnic_group = { id: null, name: null }
          }
          if (this.patient_info.career === null) {
            this.patient_info.career = { id: null, name: null }
          }
          if (this.patient_info.employee === null) {
            this.patient_info.employee = { id: null, fullname: null }
          }
          if (this.patient_info.death_confirm_staff === null) {
            this.patient_info.death_confirm_staff = {
              id: null,
              fullname: null,
            }
          }
          if (this.patient_info.cause_of_death === null) {
            this.patient_info.cause_of_death = {
              id: null,
              name: null,
            }
          }

          if (this.patient.patient_contacts.length > 0) {
            this.patient.patient_contacts = data.patients[0].patient_contacts
            for (
              let index = 0;
              index < this.patient.patient_contacts.length;
              index++
            ) {
              const element = this.patient.patient_contacts[index]
              element.contact_states = []
              element.contact_districts = []
              element.contact_wards = []
              if (element.state === null || element.state.id === null) {
                element.contact_states = this.states
                element.contact_districts = []
                element.contact_wards = []

                element.state = { id: null, name: null }
                element.district = { id: null, name: null }
                element.ward = { id: null, name: null }
              } else {
                element.contact_states = this.states
                element.contact_districts = element.state.districts
                if (element.district === null) {
                  element.district = { id: null, name: null }
                } else {
                  for (
                    let indexDistrict = 0;
                    indexDistrict < element.contact_districts.length;
                    indexDistrict++
                  ) {
                    if (
                      element.district.id ===
                      element.contact_districts[indexDistrict].id
                    ) {
                      element.contact_wards =
                        element.contact_districts[indexDistrict].wards
                    }
                  }
                }
              }
              if (element.ward === null) {
                element.ward = { id: null, name: null }
              }
            }
          } else {
            this.patient.patient_contacts = [
              // {
              //   contact_states: this.states,
              //   contact_districts: [],
              //   contact_wards: [],
              //   enum_gender: {
              //     code: null,
              //     name: null,
              //   },
              //   fullname_contact: null,
              //   phone_contact: null,
              //   email_contact: null,
              //   address_contact: null,
              //   state: { id: null, name: null },
              //   district: { id: null, name: null },
              //   ward: { id: null, name: null },
              // },
            ]
          }
        } else {
          console.log('add patient screen')
          this.patient_info.career = data.careers[0]
          this.patient_info.country = data.countries[0]
          for (let index = 0; index < this.countries.length; index++) {
            const element = this.countries[index]
            if (element.name === 'Việt nam') {
              this.patient_info.country = element
              this.tempCountry = element
            }
          }
          // this.patient.patient_contacts[0].contact_states = data.states

          for (let index = 0; index < this.states.length; index++) {
            const element = this.states[index]
            if (element.name === 'Tp. HCM') {
              this.patient_info.state = element
              this.districts = element.districts
              for (let index = 0; index < element.districts.length; index++) {
                const elementditrict = element.districts[index]
                if (elementditrict.name === 'Quận 1') {
                  this.patient_info.district = elementditrict
                  this.wards = elementditrict.wards
                  this.patient_info.ward = elementditrict.wards[0]
                }
              }
            }
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
    computedDateFormatted() {
      return this.formatDate(this.patient.birthday, 'birthday')
    },
    computedDateFormattedHiTo() {
      return this.formatDate(this.patient_hicard.hi_datefrom, 'hifrom')
    },
    computedDateFormattedHiFrom() {
      return this.formatDate(this.patient_hicard.hi_dateto, 'hito')
    },
  },

  watch: {
    dateFormatted(val) {
      this.parseDate(val, 'birthday')
    },
    dateFormattedid_card_issue_date(val) {
      this.parseDate(val, 'id_card_issue_date')
    },
    dateHiDateToFormatted(val) {
      this.parseDate(val, 'hito')
    },
    dateHiDateFromFormatted(val) {
      this.parseDate(val, 'hifrom')
    },
    'patient.id_card_issue_date'(val) {
      this.dateFormattedid_card_issue_date = this.formatDate(
        this.patient.id_card_issue_date,
        'id_card_issue_date '
      )
    },
    'patient.birthday'(val) {
      this.dateFormatted = this.formatDate(this.patient.birthday, 'birthday')
    },
    'patient_hicard.hi_dateto'(val) {
      this.dateHiDateToFormatted = this.formatDate(
        this.patient_hicard.hi_dateto,
        'hito'
      )
    },
    'patient_hicard.hi_datefrom'(val) {
      this.dateHiDateFromFormatted = this.formatDate(
        this.patient_hicard.hi_datefrom,
        'hifrom'
      )
    },
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    'patient_info.state'(newVal) {
      if (newVal) {
        // this.wards = []
        // this.patient_info.ward = {
        //   id: null,
        //   name: null,
        // }
        // this.patient_info.district = {
        //   id: null,
        //   name: null,
        // }
        this.districts = newVal.districts
      }
    },

    'patient_info.district'(newVal) {
      if (newVal) {
        // this.patient_info.ward = {
        //   id: null,
        //   name: null,
        // }

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
    insertPatientVariant() {
      const query = `mutation MyMutation2($internal_hospital_id: Int, $is_synced: Int, $patient_id: uuid) {
  insert_patient_variants(on_conflict: {constraint: patient_variants_patient_id_internal_hospital_id_key, update_columns: is_synced}, objects: {internal_hospital_id: $internal_hospital_id, is_synced: $is_synced, patient_id: $patient_id}) {
    affected_rows
  }
}
`
      // console.log('query', query)
      this.$apollo.mutate({
        mutation: gql(query),
        variables: {
          internal_hospital_id: localStorage.getItem('hospital'),
          patient_id: this.patient.id,
          is_synced: 0,
        },
        update: (store, { data: { insert_patient_variants } }) => {
          if (insert_patient_variants.affected_rows) {
            // thêm
          }
        },
      })
    },
    getDisplayValue(date) {
      // const date = this.date ? this.date : this.value
      if (date) {
        console.log('date', moment(date).format('DD-MM-YYYY'))
        return moment(date).format('DD-MM-YYYY')
      }
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase()
      const textTwo = item.code.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.includes(searchText) || textTwo.includes(searchText)
    },
    checkInfo() {
      if (this.patient.middle_name === null) {
        this.patient.middle_name = ''
      }
      if (this.isHaveIdCard) {
        if (
          this.patient.id_card_no === '' ||
          this.patient.id_card_no === null
        ) {
          this.textSnackbar = 'Vui lòng chọn CMND/Passport'
          this.snackbar = true
          return true
        }
      }
      if (this.patient_info.country.id === null) {
        this.textSnackbar = 'Vui lòng nhập quốc tịch'
        this.snackbar = true
        return true
      }
      this.patient.fullname =
        this.patient.first_name +
        ' ' +
        this.patient.middle_name +
        ' ' +
        this.patient.last_name
      if (this.patient.fullname === '  ') {
        this.textSnackbar = 'Vui lòng nhập họ tên'
        this.snackbar = true
        return true
      }
      if (this.patient_info.apartment_num === '') {
        this.textSnackbar = 'Vui lòng nhập địa chỉ'
        this.snackbar = true
        return true
      }

      if (this.patient.birthday === '') {
        this.textSnackbar = 'Vui lòng chọn ngày sinh'
        this.snackbar = true
        return true
      }

      if (this.patient_info.career.id === null) {
        this.textSnackbar = 'Vui lòng chọn nghề nghiệp'
        this.snackbar = true
        return true
      }
      if (this.patient.phone_number === '') {
        this.textSnackbar = 'Vui lòng chọn sđt'
        this.snackbar = true
        return true
      }
      if (this.patient_info.state.id === null) {
        this.textSnackbar = 'Vui lòng chọn tỉnh/thành'
        this.snackbar = true
        return true
      }
      if (this.patient_info.district.id === null) {
        this.textSnackbar = 'Vui lòng chọn quận/huyện/tp trực thuộc'
        this.snackbar = true
        return true
      }
      if (this.patient_info.ward.id === null) {
        this.textSnackbar = 'Vui lòng chọn phường/xã'
        this.snackbar = true
        return true
      }
      for (
        let index = 0;
        index < this.patient.patient_contacts.length;
        index++
      ) {
        const element = this.patient.patient_contacts[index]
        if (element.state.id === null) {
          this.textSnackbar = 'Vui lòng chọn tỉnh/thành người nhà'
          this.snackbar = true
          return true
        }
        if (element.district.id === null) {
          this.textSnackbar = 'Vui lòng chọn phường/xã người nhà'
          this.snackbar = true
          return true
        }
        if (element.enum_gender.code === null) {
          this.textSnackbar = 'Vui lòng chọn giới tính người nhà'
          this.snackbar = true
          return true
        }
        if (element.ward.id === null) {
          this.textSnackbar = 'Vui lòng chọn quận/huyện/tp trực thuộc người nhà'
          this.snackbar = true
          return true
        }
        if (
          element.fullname_contact === null ||
          element.fullname_contact === ''
        ) {
          this.textSnackbar = 'Vui lòng nhập họ tên người nhà'
          this.snackbar = true
          return true
        }
        if (
          element.address_contact === '' ||
          element.address_contact === null
        ) {
          this.textSnackbar = 'Vui lòng nhập địa chỉ người nhà'
          this.snackbar = true
          return true
        }
        if (element.phone_contact === null || element.phone_contact === '') {
          this.textSnackbar = 'Vui lòng nhập sđt người nhà'
          this.snackbar = true
          return true
        }
      }
      return false
    },
    save() {
      this.dialogSave = false
      if (this.checkInfo()) {
        return
      }
      if (!this.isHaveIdCard) {
        this.patient.id_card_no = ''
        this.patient.id_card_issue_date = null
        // this.patient.id_card_issue_place = ''
      }
      this.isEdit === false
        ? this.addPatientFunction2()
        : this.updatePatientFunction()
    },
    formatDate(date, type) {
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
        if (type === 'birthday') {
          this.patient.birthday = ''
        } else if (type === 'hifrom') {
          this.patient_hicard.hi_datefrom = ''
        } else if (type === 'hito') {
          this.patient_hicard.hi_dateto = ''
        } else if (type === 'id_card_issue_date') {
          this.patient.id_card_issue_date = ''
        }
        return null
      }
      return `${day}-${month}-${year}`
    },
    parseDate(date, type) {
      if (!date) return null

      //     this.dateFormattedid_card_issue_date = ''

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
        if (type === 'birthday') {
          this.dateFormatted = date
        } else if (type === 'hifrom') {
          this.dateHiDateFromFormatted = date
        } else if (type === 'hito') {
          this.dateHiDateToFormatted = date
        } else if (type === 'id_card_issue_date') {
          this.dateFormattedid_card_issue_date = date
        }
        if (date.length === 10) {
          if (
            (type === 'birthday' || type === 'id_card_issue_date') &&
            moment(`${year}-${month}-${day}`).isAfter(this.dateNow)
          ) {
            this.resetDataDate(type)
            return null
          }
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
            this.resetDataDate(type)

            return null
          }
          return `${year}-${month}-${day}`
        }
      } else {
        this.resetDataDate(type)
        return ''
      }
    },
    resetDataDate(type) {
      this.textSnackbar = 'Nhập ngày ko đúng định dạng'
      this.snackbar = true
      if (type === 'birthday') {
        this.patient.birthday = ''
        this.dateFormatted = ' '
        this.dateFormatted = ''
      } else if (type === 'hifrom') {
        this.patient_hicard.hi_datefrom = ''
        this.dateHiDateFromFormatted = ' '
        this.dateHiDateFromFormatted = ''
      } else if (type === 'hito') {
        this.patient_hicard.hi_dateto = ''
        this.dateHiDateToFormatted = ' '
        this.dateHiDateToFormatted = ''
      } else if (type === 'id_card_issue_date') {
        this.patient.id_card_issue_date = ''
        this.dateFormattedid_card_issue_date = ' '
        this.dateFormattedid_card_issue_date = ''
      }
    },
    backToList() {
      this.$router.push({
        path: `/list/old_core/patient/patients`,
      })
    },
    addMoreFamilyPatient() {
      this.patient.patient_contacts.push({
        contact_states: this.states,
        contact_districts: [],
        contact_wards: [],
        enum_gender: {
          code: null,
          name: null,
        },
        fullname: null,
        phone: null,
        email: null,
        address: null,
        state: { id: null, name: null, contact_districts: [] },
        district: { id: null, name: null, contact_wards: [] },
        ward: { id: null, name: null },
      })
    },
    handleChangeContactState(newVal) {
      if (newVal.state) {
        newVal.contact_districts = newVal.state.districts
      }
    },

    handleChangeContactDistrict(newVal) {
      if (newVal.district) {
        newVal.contact_wards = newVal.district.wards
      }
    },
    deleteFamilyPatient(i) {
      this.patient.patient_contacts.splice(i, 1)
    },
    updatePatientFunction() {
      if (
        this.patient_hicard.hi_number !== '' &&
        this.patient_hicard.hi_number !== null
      ) {
        this.patient_info.hashicard = true
        this.patient_info.hicard_id = this.patient_hicard.hi_number
      }

      this.time_death_string = ''
      this.patient.patient_info_date_death === null ||
      this.patient.patient_info_time_death === null
        ? (this.time_death_string = null)
        : (this.time_death_string =
            this.patient.patient_info_date_death +
            ' ' +
            this.patient.patient_info_time_death)

      this.hicard_issued_time_string = ''
      this.patient_hicard.hicard_issued_date === null ||
      this.patient.patient_hicards_issued_time === null
        ? (this.hicard_issued_time_string = null)
        : (this.hicard_issued_time_string =
            this.patient_hicard.hicard_issued_date +
            ' ' +
            this.patient.patient_hicards_issued_time)

      this.hi_datefrom_string = ''
      this.patient.patient_hicards_date_from === null ||
      this.patient.patient_hicards_time_from === null
        ? (this.hi_datefrom_string = null)
        : (this.hi_datefrom_string =
            this.patient.patient_hicards_date_from +
            ' ' +
            this.patient.patient_hicards_time_from)

      this.hi_dateto_string = ''
      this.patient.patient_hicards_date_to === null ||
      this.patient.patient_hicards_time_to === null
        ? (this.hi_dateto_string = null)
        : (this.hi_dateto_string =
            this.patient.patient_hicards_date_to +
            ' ' +
            this.patient.patient_hicards_time_to)

      const fullnamePatient =
        this.patient.first_name +
        ' ' +
        this.patient.middle_name +
        ' ' +
        this.patient.last_name
      const tempPlain_name = this.convertViToEn(fullnamePatient)
      if (
        this.patient_info.ward === null ||
        this.patient_info.ward === undefined
      ) {
        this.patient_info.ward = {
          id: null,
          name: null,
        }
      }

      const patientContactList = []
      for (
        let index = 0;
        index < this.patient.patient_contacts.length;
        index++
      ) {
        const element = this.patient.patient_contacts[index]
        const patientContact = {}
        patientContact.fullname_contact = element.fullname_contact
        patientContact.phone_contact = element.phone_contact
        patientContact.gender = element.enum_gender.code
        patientContact.email_contact = element.email_contact
        patientContact.address_contact = element.address_contact
        if (element.state) {
          patientContact.state_contact_id = element.state.id
        }
        if (element.ward) {
          patientContact.ward_contact_id = element.ward.id
        }
        if (element.district) {
          patientContact.district_contact_id = element.district.id
        }
        patientContact.patient_id = this.patient.id
        patientContactList.push(patientContact)
      }
      let insert_patient_contacts_query = ''
      let insert_patient_contacts_query2 = ''
      if (this.patient.patient_contacts.length > 0) {
        insert_patient_contacts_query = `insert_patient_contacts(objects: $objects3) {
            affected_rows
            returning {
              id
            }
          }`
        insert_patient_contacts_query2 =
          '$objects3: [patient_contacts_insert_input!]!'
      }
      const updatePatientGraphl = gql`
        mutation updatePatient(
          $id: uuid
          $phone_number: String
          $address: String
          $email: String
          $fullname: String!
          $first_name: String!
          $gender: enum_gender_enum!
          $hospital_code: String!
          $id_card_no: String
          $id_card_issue_date: date
          $id_card_issue_place: String
          $last_name: String!
          $medical_code: String!
          $middle_name: String
          $note: String
          $passport_no: String
          $birthday: date!
          $work_unit_id: Int
          $work_address: String
          $ward_id: Int
          $state_id: Int
          $plain_name: String
          $permanent_address: String
          $ethnic_group_id: Int
          $is_foreigner: Boolean
          $hashicard: Boolean
          $district_id: Int
          $country_id: Int
          $contact_address: String
          $blood_group_id: Int
          $career_id: Int
          $apartment_num: String
          $hicard_id: String
          $hi_datefrom: date
          $hi_dateto: date
          $hi_number: String
          $hi_type: Int
          $hospital_kcb_id: Int
          $is_active: Boolean
          ${insert_patient_contacts_query2}
          $internal_hospital_id: Int
          $is_synced: Int
        ) {
          delete_patient_contacts(where: { patient_id: { _eq: $id } }) {
            affected_rows
          }
          update_patients(
            where: { id: { _eq: $id } }
            _set: {
              address: $address
              birthday: $birthday
              email: $email
              first_name: $first_name
              fullname: $fullname
              gender: $gender
              hospital_code: $hospital_code
              id_card_no: $id_card_no
              id_card_issue_date: $id_card_issue_date
              id_card_issue_place: $id_card_issue_place
              last_name: $last_name
              middle_name: $middle_name
              medical_code: $medical_code
              note: $note
              passport_no: $passport_no
              phone_number: $phone_number
              is_synced: $is_synced
            }
          ) {
            affected_rows
          }

          update_patient_info(
            where: { patient_id: { _eq: $id } }
            _set: {
              apartment_num: $apartment_num
              blood_group_id: $blood_group_id
              career_id: $career_id
              country_id: $country_id
              district_id: $district_id
              hashicard: $hashicard
              is_foreigner: $is_foreigner
              ethnic_group_id: $ethnic_group_id
              permanent_address: $permanent_address
              plain_name: $plain_name
              state_id: $state_id
              ward_id: $ward_id
              work_address: $work_address
              work_unit_id: $work_unit_id
              contact_address: $contact_address
            }
          ) {
            affected_rows
          }

          update_patient_hicard(
            where: { patient_id: { _eq: $id } }
            _set: {
              hi_datefrom: $hi_datefrom
              hi_type: $hi_type
              is_active: $is_active
              hi_number: $hi_number
              hi_dateto: $hi_dateto
              hospital_kcb_id: $hospital_kcb_id
            }
          ) {
            affected_rows
          }
          ${insert_patient_contacts_query}
          insert_patient_variants(
            on_conflict: {
              constraint: patient_variants_patient_id_internal_hospital_id_key
              update_columns: is_synced
            }
            objects: {
              internal_hospital_id: $internal_hospital_id
              is_synced: $is_synced
              patient_id: $id
            }
          ) {
            affected_rows
          }
        }
      `
      if (this.patient.patient_contacts.length > 0) {
        this.$apollo.mutate({
          mutation: updatePatientGraphl,
          variables: {
            id: this.patient.id,
            passport_no: this.patient.passport_no,
            note: this.patient.note,
            hospital_code: this.patient.hospital_code,
            gender: this.patient.enum_gender.code,
            email: this.patient.email,
            birthday: this.patient.birthday,
            address: this.patient.address,
            phone_number: this.patient.phone_number,
            medical_code: this.patient.medical_code,
            last_name: this.patient.last_name,
            middle_name: this.patient.middle_name,
            first_name: this.patient.first_name,
            fullname: fullnamePatient,
            id_card_no: this.patient.id_card_no,
            id_card_issue_date: this.patient.id_card_issue_date,
            id_card_issue_place: this.patient.id_card_issue_place,

            // patient_hicard
            hi_number: this.patient_hicard.hi_number,
            hi_type: this.patient_hicard.hi_type,
            hi_datefrom: this.patient_hicard.hi_datefrom,
            hi_dateto: this.patient_hicard.hi_dateto,
            hospital_kcb_id: this.patient_hicard.hospital_kcb.id,
            is_active: this.patient_hicard.is_active,

            // patient_info
            work_unit_id: this.patient_info.work_unit.id,
            work_address: this.patient_info.work_address,
            ward_id: this.patient_info.ward.id,
            state_id: this.patient_info.state.id,
            // staff_code: this.patient_info.staff_code,
            // smoking_history: this.patient_info.smoking_history,
            plain_name: tempPlain_name,
            // rh_factor_id: this.patient_info.rh_factor_id,
            permanent_address: this.patient_info.permanent_address,
            // patient_type: this.patient_info.patient_type,
            // outpatient_number: this.patient_info.outpatient_number,
            // ordinal: this.patient_info.ordinal,
            ethnic_group_id: this.patient_info.ethnic_group.id,
            // is_overseas: this.patient_info.is_overseas,
            is_foreigner: this.patient_info.is_foreigner,
            // isMarried: this.patient_info.isMarried,
            // isDeath: this.patient_info.isDeath,
            // inpatient_number: this.patient_info.inpatient_number,
            // image_source: this.patient_info.image_source,
            hashicard: this.patient_info.hashicard,
            // employee_id: this.patient_info.employee.id,
            district_id: this.patient_info.district.id,
            // death_date: this.time_death_string,
            // death_confirm_staff_id: this.patient_info.death_confirm_staff.id,
            country_id: this.patient_info.country.id,
            contact_address: this.patient_info.contact_address,
            // cause_of_death_id: this.patient_info.cause_of_death.id,
            blood_group_id: this.patient_info.blood_group.id,
            career_id: this.patient_info.career.id,
            apartment_num: this.patient_info.apartment_num,
            // anamnesis: this.patient_info.anamnesis,
            // allergy: this.patient_info.allergy,
            // hicard_id: this.patient_info.hicard_id,

            objects3: patientContactList,

            internal_hospital_id: localStorage.getItem('hospital'),
            is_synced: 0,
          },
          update: (store, { data: { update_patients } }) => {
            if (update_patients.affected_rows) {
              // this.$apollo.queries.careers.refetch()
              this.textSnackbar = 'Cập nhật bệnh nhân thành công'
              this.snackbar = true
              this.awaitDirect()
            } else {
              this.textSnackbar = 'Cập nhật bệnh nhân thất bại'
              this.snackbar = true
            }
          },
        })
      } else {
        this.$apollo.mutate({
          mutation: updatePatientGraphl,
          variables: {
            id: this.patient.id,
            passport_no: this.patient.passport_no,
            note: this.patient.note,
            hospital_code: this.patient.hospital_code,
            gender: this.patient.enum_gender.code,
            email: this.patient.email,
            birthday: this.patient.birthday,
            address: this.patient.address,
            phone_number: this.patient.phone_number,
            medical_code: this.patient.medical_code,
            last_name: this.patient.last_name,
            middle_name: this.patient.middle_name,
            first_name: this.patient.first_name,
            fullname: fullnamePatient,
            id_card_no: this.patient.id_card_no,
            id_card_issue_date: this.patient.id_card_issue_date,
            id_card_issue_place: this.patient.id_card_issue_place,

            // patient_hicard
            hi_number: this.patient_hicard.hi_number,
            hi_type: this.patient_hicard.hi_type,
            hi_datefrom: this.patient_hicard.hi_datefrom,
            hi_dateto: this.patient_hicard.hi_dateto,
            hospital_kcb_id: this.patient_hicard.hospital_kcb.id,
            is_active: this.patient_hicard.is_active,

            // patient_info
            work_unit_id: this.patient_info.work_unit.id,
            work_address: this.patient_info.work_address,
            ward_id: this.patient_info.ward.id,
            state_id: this.patient_info.state.id,
            // staff_code: this.patient_info.staff_code,
            // smoking_history: this.patient_info.smoking_history,
            plain_name: tempPlain_name,
            // rh_factor_id: this.patient_info.rh_factor_id,
            permanent_address: this.patient_info.permanent_address,
            // patient_type: this.patient_info.patient_type,
            // outpatient_number: this.patient_info.outpatient_number,
            // ordinal: this.patient_info.ordinal,
            ethnic_group_id: this.patient_info.ethnic_group.id,
            // is_overseas: this.patient_info.is_overseas,
            is_foreigner: this.patient_info.is_foreigner,
            // isMarried: this.patient_info.isMarried,
            // isDeath: this.patient_info.isDeath,
            // inpatient_number: this.patient_info.inpatient_number,
            // image_source: this.patient_info.image_source,
            hashicard: this.patient_info.hashicard,
            // employee_id: this.patient_info.employee.id,
            district_id: this.patient_info.district.id,
            // death_date: this.time_death_string,
            // death_confirm_staff_id: this.patient_info.death_confirm_staff.id,
            country_id: this.patient_info.country.id,
            contact_address: this.patient_info.contact_address,
            // cause_of_death_id: this.patient_info.cause_of_death.id,
            blood_group_id: this.patient_info.blood_group.id,
            career_id: this.patient_info.career.id,
            apartment_num: this.patient_info.apartment_num,
            // anamnesis: this.patient_info.anamnesis,
            // allergy: this.patient_info.allergy,
            // hicard_id: this.patient_info.hicard_id,

            internal_hospital_id: localStorage.getItem('hospital'),
            is_synced: 0,
          },
          update: (store, { data: { update_patients } }) => {
            if (update_patients.affected_rows) {
              // this.$apollo.queries.careers.refetch()
              this.textSnackbar = 'Cập nhật bệnh nhân thành công'
              this.snackbar = true
              this.awaitDirect()
            } else {
              this.textSnackbar = 'Cập nhật bệnh nhân thất bại'
              this.snackbar = true
            }
          },
        })
      }
    },
    awaitDirect() {
      setTimeout(() => this.backToList(), 1500)
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

    addPatientFunction2() {
      // console.log('data_patients')
      if (
        this.patient_hicard.hi_number !== '' &&
        this.patient_hicard.hi_number !== null
      ) {
        this.patient_info.hashicard = true
        this.patient_info.hicard_id = this.patient_hicard.hi_number
      }

      // this.patient.gender === 'Nam'
      //   ? (this.patient.gender = 'male')
      //   : (this.patient.gender = 'female')
      const data_patients = {}
      data_patients.passport_no = this.patient.passport_no
      data_patients.note = this.patient.note
      data_patients.hospital_code = this.patient.hospital_code
      data_patients.gender = this.patient.enum_gender.code
      data_patients.email = this.patient.email
      data_patients.birthday = this.patient.birthday
      data_patients.address = this.patient.address
      data_patients.phone_number = this.patient.phone_number
      // data_patients.medical_code = this.patient.medical_code
      data_patients.last_name = this.patient.last_name
      data_patients.middle_name = this.patient.middle_name
      data_patients.first_name = this.patient.first_name
      data_patients.fullname =
        this.patient.first_name +
        ' ' +
        this.patient.middle_name +
        ' ' +
        this.patient.last_name
      const tempPlain_name = this.convertViToEn(data_patients.fullname)

      data_patients.id_card_no = this.patient.id_card_no
      data_patients.id_card_issue_date = this.patient.id_card_issue_date
      data_patients.id_card_issue_place = this.patient.id_card_issue_place

      this.time_death_string = ''
      this.patient.patient_info_date_death === null ||
      this.patient.patient_info_time_death === null
        ? (this.time_death_string = null)
        : (this.time_death_string =
            this.patient.patient_info_date_death +
            ' ' +
            this.patient.patient_info_time_death)
      if (
        this.patient_info.ward === null ||
        this.patient_info.ward === undefined
      ) {
        this.patient_info.ward = {
          id: null,
          name: null,
        }
      }

      const patient_infos = {}
      patient_infos.data = {}
      patient_infos.data.work_unit_id = this.patient_info.work_unit.id
      patient_infos.data.work_address = this.patient_info.work_address
      patient_infos.data.ward_id = this.patient_info.ward.id
      patient_infos.data.state_id = this.patient_info.state.id
      // patient_infos.data.staff_code = this.patient_info.staff_code
      // patient_infos.data.smoking_history = this.patient_info.smoking_history
      patient_infos.data.plain_name = tempPlain_name
      // patient_infos.data.rh_factor_id = this.patient_info.rh_factor_id
      patient_infos.data.permanent_address = this.patient_info.permanent_address
      // patient_infos.data.patient_type = this.patient_info.patient_type
      // patient_infos.data.outpatient_number = this.patient_info.outpatient_number
      // patient_infos.data.ordinal = this.patient_info.ordinal
      patient_infos.data.ethnic_group_id = this.patient_info.ethnic_group.id
      // patient_infos.data.is_overseas = this.patient_info.is_overseas
      patient_infos.data.is_foreigner = this.patient_info.is_foreigner
      // patient_infos.data.isMarried = this.patient_info.isMarried
      // patient_infos.data.isDeath = this.patient_info.isDeath
      // patient_infos.data.inpatient_number = this.patient_info.inpatient_number
      // patient_infos.data.image_source = this.patient_info.image_source
      patient_infos.data.hashicard = this.patient_info.hashicard
      // patient_infos.data.employee_id = this.patient_info.employee.id
      patient_infos.data.district_id = this.patient_info.district.id
      // patient_infos.data.death_date = this.time_death_string
      // patient_infos.data.death_confirm_staff_id = this.patient_info.death_confirm_staff.id
      patient_infos.data.country_id = this.patient_info.country.id
      patient_infos.data.contact_address = this.patient_info.contact_address
      // patient_infos.data.cause_of_death_id = this.patient_info.cause_of_death.id
      patient_infos.data.blood_group_id = this.patient_info.blood_group.id
      patient_infos.data.career_id = this.patient_info.career.id
      patient_infos.data.apartment_num = this.patient_info.apartment_num
      // patient_infos.data.anamnesis = this.patient_info.anamnesis
      // patient_infos.data.allergy = this.patient_info.allergy
      // patient_infos.data.hicard_id = this.patient_info.hicard_id
      data_patients.patient_infos = patient_infos

      this.hicard_issued_time_string = ''
      this.patient_hicard.hicard_issued_date === null ||
      this.patient.patient_hicards_issued_time === null
        ? (this.hicard_issued_time_string = null)
        : (this.hicard_issued_time_string =
            this.patient_hicard.hicard_issued_date +
            ' ' +
            this.patient.patient_hicards_issued_time)

      this.hi_datefrom_string = ''
      this.patient.patient_hicards_date_from === null ||
      this.patient.patient_hicards_time_from === null
        ? (this.hi_datefrom_string = null)
        : (this.hi_datefrom_string =
            this.patient.patient_hicards_date_from +
            ' ' +
            this.patient.patient_hicards_time_from)

      this.hi_dateto_string = ''
      this.patient.patient_hicards_date_to === null ||
      this.patient.patient_hicards_time_to === null
        ? (this.hi_dateto_string = null)
        : (this.hi_dateto_string =
            this.patient.patient_hicards_date_to +
            ' ' +
            this.patient.patient_hicards_time_to)
      const patient_hicards = {}
      patient_hicards.data = {}
      patient_hicards.data.hi_number = this.patient_hicard.hi_number
      patient_hicards.data.hi_type = this.patient_hicard.hi_type
      // patient_hicards.data.hicard_issued_date = this.patient_hicard.hicard_issued_date
      // patient_hicards.data.hicard_issued_time = this.hicard_issued_time_string
      // patient_hicards.data.hi_datefrom = this.hi_datefrom_string
      // patient_hicards.data.hi_dateto = this.hi_dateto_string
      patient_hicards.data.hi_dateto = this.patient_hicard.hi_dateto
      patient_hicards.data.hi_datefrom = this.patient_hicard.hi_datefrom
      patient_hicards.data.hospital_kcb_id = this.patient_hicard.hospital_kcb.id
      patient_hicards.data.is_active = this.patient_hicard.is_active

      data_patients.patient_hicards = patient_hicards

      if (this.patient.patient_contacts.length > 0) {
        const patientContactList = []
        for (
          let index = 0;
          index < this.patient.patient_contacts.length;
          index++
        ) {
          const element = this.patient.patient_contacts[index]
          const patientContact = {}
          patientContact.fullname_contact = element.fullname_contact
          patientContact.phone_contact = element.phone_contact
          patientContact.gender = element.enum_gender.code
          patientContact.email_contact = element.email_contact
          patientContact.address_contact = element.address_contact
          if (element.state) {
            patientContact.state_contact_id = element.state.id
          }
          if (element.ward) {
            patientContact.ward_contact_id = element.ward.id
          }
          if (element.district) {
            patientContact.district_contact_id = element.district.id
          }
          patientContactList.push(patientContact)
        }
        data_patients.patient_contacts = {}

        data_patients.patient_contacts.data = patientContactList
      }

      // console.log('data_patients', data_patients)
      const query = `mutation MyMutation($objects: [patients_insert_input!]!) {
            insert_patients(objects: $objects) {
              affected_rows
              returning {
                id
              }
            }
          }`
      // console.log('query', query)
      this.$apollo.mutate({
        mutation: gql(query),
        variables: {
          objects: data_patients,
        },
        update: (store, { data: { insert_patients } }) => {
          if (insert_patients.affected_rows) {
            // eslint-disable-next-line
            this.insertPatientVariant()
            this.$apollo.queries.patients.refetch()
            this.textSnackbar = 'Thêm bệnh nhân thành công'
            this.snackbar = true
            this.awaitDirect()
          } else {
            this.textSnackbar = 'Thêm bệnh nhân thất bại'
            this.snackbar = true
          }
        },
      })
    },
  },
}
</script>
<style scoped lang="css">
.col-MaBHYT {
  max-width: 790.5px;
}
.col-MaBHYT2 {
  max-width: 146.5px;
}
</style>
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
