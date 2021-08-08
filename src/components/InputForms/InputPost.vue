<template>
    <div>
        <v-sheet max-width="200">
            <v-text-field
            :value="zipcode"
            label="우편번호"
            readonly
            prepend-icon="mdi-map-marker"
            :rules="required ? [rules.require({label:'주소'})] : []"
            >
                <template v-slot:append>
                    <v-btn icon small tabindex="-1" @click="openDialog">
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </v-sheet>
        <v-text-field label="주소" :value="addr1" readonly></v-text-field>
        <v-text-field label="상세주소" :value="addr2" @input="$emit('update:addr2', $event)"></v-text-field>
        <v-dialog v-model="dialog" max-width="500" persistent>
            <v-toolbar>
                <v-toolbar-title>주소검색</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon plain @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <daum-postcode
                v-if="themeChange"
                :on-complete="handelAddress"
                :animation="true"
                 :theme="isDark ? darkStyle : lightStyle"
                />
               
            
        </v-dialog>
    </div>
</template>

<script>
import validateRules from '../../../util/validateRules'
import DaumPostcode from 'vuejs-daum-postcode'

export default {
    name : "InputPost",
    components : {DaumPostcode},
    props : {
        //우편번호
        zipcode : String,
        //주소1
        addr1 : String,
        //주소2
        addr2 : String,
        required : {
            type : Boolean,
            default : true,
        }
    },
    data() {
        return {
            dialog : false,
            darkStyle : {
                bgColor : '#121212',
                searchBgColor : '#131313',
                contentBgColor : '#272727',
                pageBgColor : '#121212',
                textColor : '#FFFFFF',
                queryTextColor : '#FFFFFF',
                outlineColor : '#444444'
            },
            lightStyle : {
                bgColor : '#ECECEC'
            },
            themeChange : true,
        }
    },
    computed :{
        rules : () => validateRules, 
        isDark() {
            this.themeChange = false;

            this.$nextTick(() => {
                this.themeChange = true;
            });

            return this.$vuetify.theme.isDark
        }
    },
    methods : {
        openDialog(){
            this.dialog = true;
        },
        closeDialog(){
            this.dialog = false;
        },
        handelAddress(data){ 
            let fullAddress = data.address
            let extraAddress = ''
            if (data.addressType === 'R') {
                if (data.bname !== '') {
                extraAddress += data.bname
                }
                if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName)
                }
                fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '')
            }
            
            console.log(data.zonecode, fullAddress) // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'

            this.$emit('update:zipcode', data.zonecode);
            this.$emit('update:addr1', fullAddress);
            this.closeDialog();
        }

    
    }
}
</script>

<style>

</style>