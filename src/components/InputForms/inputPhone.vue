<template>
    <v-text-field
     :value="value"
     @keyup="onInput"
     v-bind="$attrs"
     :maxlength="$attrs.counter || max"
    />
</template>

<script>
export default {
    name : 'InputPhone',
    model : {
        prop : 'value',
        event : 'input'
    },
    props : {
        value : String
    },
    data() {
        return {
           max : 13
        }
    },
    methods : {
        onInput(event){
            const val = this.autoDash(event.target.value);
            this.$emit('input', val);
            // val = this.autoDash(val);
            // this.$emit('input', val)
        },
        autoDash(val){
            val = val.replace(/[^\d]/g, '');
            console.log(val);
            let pattern = null;
            if(val[0] != 0) { //000-0000
                if(val.length < 8){
                    pattern = /([\d]{0,3})([\d]{0,4})/
                } else {
                    pattern = /([\d]{0,4})([\d]{0,4})/
                }
                this.max = 8
            } else if(val[1] == 2){ // 02 시작
                if(val.length < 10){
                    pattern = /([\d]{0,2})([\d]{0,3})([\d]{0,4})/
                } else {
                    pattern = /([\d]{0,2})([\d]{0,4})([\d]{0,4})/
                }
                this.max = 12
            } else {
                  if(val.length < 11){
                    pattern = /([\d]{0,3})([\d]{0,3})([\d]{0,4})/
                } else {
                    pattern = /([\d]{0,3})([\d]{0,4})([\d]{0,4})/
                }
                this.max = 13
            }

            //정규표현식에 대한 실행
            const matchs = pattern.exec(val);
            //console.log(matchs);
            let rVal = matchs[1];
            rVal += matchs[2] ? '-' + matchs[2]: "";
            rVal += matchs[3] ? '-' + matchs[3]: "";
            return rVal
        }
    }
}
</script>

<style>

</style>