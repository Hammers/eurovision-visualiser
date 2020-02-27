<template>
    <div class="card w-75">
        <div class="card-body row justify-content-center">
            <button class="btn btn-lg btn-primary m-1 col-6 col-sm-4 col-md-3 col-lg-2" @click="onClick(country.id)" v-for="(country,index) in this.sortedCountries" :key="index" :disabled="current.find(x => x.id === country.id) || current.length === 10">{{country.name}}</button>
        </div>
        <div class="d-flex justify-content-center">
            <button class="btn btn-danger btn-lg m-2" @click="undo" v-if="current.length > 0">Undo</button>
            <button class="btn btn-success btn-lg m-2" @click="next" v-if="current.length === 10">Next</button>
        </div>
    </div>
</template>

<script>
    import countries from '../../../json/countries'
    export default {
        name: "",
        props: ["current"],
        data() {
            return {
                countries
            }
        },
        computed: {
            sortedCountries () {
                var ordered = this.countries;
                return ordered.sort((a,b) => {return a.name.localeCompare(b.name)});
            }
        },
        methods: {
            onClick(countryId) {
                this.$emit('add-one',countryId);
            },
            next() {
                this.$emit('next');
            },
            undo() {
                this.$emit('undo');
            }
        }
    }
</script>

<style scoped>

</style>