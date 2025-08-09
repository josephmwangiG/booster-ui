<template>
  <Teleport to="body">
    <div
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      v-if="modalActive"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      ></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-[700px] w-full sm:p-6"
          >
            <div>
              <div class="modal-header flex justify-between items-center">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  Payment successful
                </h3>
                <div
                  class="flex h-6 w-6 items-center justify-center rounded-full bg-green-100"
                >
                  <svg
                    class="h-4 w-4 text-green-600 inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              </div>
              <div class="mt-3 sm:mt-5 max-h-[80vh] overflow-y-auto">
                <div class="mt-2">
                  <el-form
                    ref="ruleFormRef"
                    style="max-width: 600px"
                    :model="ruleForm"
                    :rules="rules"
                    label-width="auto"
                    class="demo-ruleForm"
                    :size="formSize"
                    status-icon
                  >
                    <el-form-item label="Activity name" prop="name">
                      <el-input v-model="ruleForm.name" />
                    </el-form-item>
                    <el-form-item label="Activity zone" prop="region">
                      <el-select
                        v-model="ruleForm.region"
                        placeholder="Activity zone"
                      >
                        <el-option label="Zone one" value="shanghai" />
                        <el-option label="Zone two" value="beijing" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="Activity count" prop="count">
                      <el-select-v2
                        v-model="ruleForm.count"
                        placeholder="Activity count"
                        :options="options"
                      />
                    </el-form-item>
                    <el-form-item label="Activity time" required>
                      <el-col :span="11">
                        <el-form-item prop="date1">
                          <el-date-picker
                            v-model="ruleForm.date1"
                            type="date"
                            aria-label="Pick a date"
                            placeholder="Pick a date"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col class="text-center" :span="2">
                        <span class="text-gray-500">-</span>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item prop="date2">
                          <el-time-picker
                            v-model="ruleForm.date2"
                            aria-label="Pick a time"
                            placeholder="Pick a time"
                            style="width: 100%"
                          />
                        </el-form-item>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="Instant delivery" prop="delivery">
                      <el-switch v-model="ruleForm.delivery" />
                    </el-form-item>
                    <el-form-item label="Activity location" prop="location">
                      <el-segmented
                        v-model="ruleForm.location"
                        :options="locationOptions"
                      />
                    </el-form-item>
                    <el-form-item label="Activity type" prop="type">
                      <el-checkbox-group v-model="ruleForm.type">
                        <el-checkbox value="Online activities" name="type">
                          Online activities
                        </el-checkbox>
                        <el-checkbox value="Promotion activities" name="type">
                          Promotion activities
                        </el-checkbox>
                        <el-checkbox value="Offline activities" name="type">
                          Offline activities
                        </el-checkbox>
                        <el-checkbox value="Simple brand exposure" name="type">
                          Simple brand exposure
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="Resources" prop="resource">
                      <el-radio-group v-model="ruleForm.resource">
                        <el-radio value="Sponsorship">Sponsorship</el-radio>
                        <el-radio value="Venue">Venue</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Activity form" prop="desc">
                      <el-input v-model="ruleForm.desc" type="textarea" />
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="submitForm(ruleFormRef)"
                      >
                        Create
                      </el-button>
                      <el-button @click="resetForm(ruleFormRef)"
                        >Reset</el-button
                      >
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-6 text-right">
              <button
                @click="emits('close-modal')"
                type="button"
                class="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
defineProps({
  modalActive: Boolean,
});
const emits = defineEmits(["close-modal"]);

import { reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";

interface RuleForm {
  name: string;
  region: string;
  count: string;
  date1: string;
  date2: string;
  delivery: boolean;
  location: string;
  type: string[];
  resource: string;
  desc: string;
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "Hello",
  region: "",
  count: "",
  date1: "",
  date2: "",
  delivery: false,
  location: "",
  type: [],
  resource: "",
  desc: "",
});

const locationOptions = ["Home", "Company", "School"];

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Please enter Activity name", trigger: "blur" },
    
  ],
  region: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  count: [
    {
      required: true,
      message: "Please select Activity count",
      trigger: "change",
    },
  ],
  date1: [
    {
      type: "date",
      required: true,
      message: "Please pick a date",
      trigger: "change",
    },
  ],
  date2: [
    {
      type: "date",
      required: true,
      message: "Please pick a time",
      trigger: "change",
    },
  ],
  location: [
    {
      required: true,
      message: "Please select a location",
      trigger: "change",
    },
  ],
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one activity type",
      trigger: "change",
    },
  ],
  resource: [
    {
      required: true,
      message: "Please select activity resource",
      trigger: "change",
    },
  ],
  desc: [
    { required: true, message: "Please enter activity form", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
</script>
<style lang=""></style>
