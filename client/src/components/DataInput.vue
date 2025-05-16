<template>
    <div class="container black my-3">
        <div class="card row justify-content-center">
            <div v-for="(vote,index) in votes" :key="index">
                <div>
                    {{vote.name}} - <span class="mx-1" v-for="country in vote.selected" :key="country">{{getCountryName(country)}}</span>
                </div>
                <div>
                    <button class="btn btn-primary" :disabled="vote.indexDisplayed >= 1" @click="bottomSeven(vote.id)">1 - 7</button>
                    <button class="btn btn-primary" :disabled="vote.indexDisplayed >= 7" @click="top(vote.id)">8</button>
                    <button class="btn btn-primary" :disabled="vote.indexDisplayed >= 8" @click="top(vote.id)">10</button>
                    <button class="btn btn-primary" :disabled="vote.indexDisplayed >= 9" @click="top(vote.id)">12</button>
                </div>
                
            </div>
            <hr>
            <div class="justify-content-center align-items-center d-flex m-2">
                <button class="btn btn-primary m-2" @click="next()">Clear Highlighted</button>
                <button class="btn btn-danger m-2" @click="audience()">Next Audience</button>
            </div>
            <div class="justify-content-center align-items-center d-flex">
                <button class="btn btn-primary m-2" @click="toggleVoting()">Toggle Voting</button> <span>{{votingEnabled ? "ON" : "OFF"}}</span>
                <button class="btn btn-primary m-2" @click="toggleResults()">Toggle Results</button> <span>{{resultsEnabled ? "ON" : "OFF"}}</span>
            </div>
            <div div class="justify-content-center align-items-center d-flex m-2">
                <button class="btn btn-small btn-danger m-2" @click="reset()">Reset</button>
            </div>
            <div class="justify-content-center align-items-center d-flex m-2" v-if="nextAudienceVote">
                <span>Next Audience Score: {{getCountryName(nextAudienceVote.id)}} - {{nextAudienceVote.score}}</span>
            </div>
        </div>  
    </div>
</template>

<script>
    import countries from '../../../json/countries'
    export default {
        name: "data-input",
        props: ["votes","votingEnabled","resultsEnabled","nextAudienceVote"],
        data() {
            return {
                countries,
                resetConfirm: false
            }
        },
        computed: {
            sortedCountries () {
                var ordered = this.countries;
                return ordered.sort((a,b) => {return a.name.localeCompare(b.name)});
            }
        },
        methods: {
            bottomSeven(id) {
                this.$emit('bottom-seven',id);
            },
            top(id) {
                this.$emit('top',id);
            },
            next() {
                this.$emit('next');
            },
            reset() {
                this.resetConfirm = false;
                this.$emit('reset');
            },
            audience() {
                this.$emit('audience');
            },
            toggleVoting() {
                this.$emit('toggle-voting');
            },
            toggleResults() {
                this.$emit('toggle-results');
            },
            getCountryName(id) {
                return this.countries.find(x => x.id === id).name;
            }
        }
    }
</script>

<style scoped>
.black {
  color: #111111;
}
</style>