<template>
    <div class="my-3">
        <div class="card row justify-content-center">
            <div v-for="(vote,index) in votes" :key="index">
                {{vote.name}} 
                <button class="btn btn-primary" :disabled="vote.indexDisplayed >= 1" @click="bottomSeven(vote.name)">1 - 7</button>
                <button class="btn btn-primary" :disabled="vote.indexDisplayed >= 7" @click="top(vote.name)">8</button>
                <button class="btn btn-primary" :disabled="vote.indexDisplayed >= 8" @click="top(vote.name)">10</button>
                <button class="btn btn-primary" :disabled="vote.indexDisplayed >= 9" @click="top(vote.name)">12</button>
            </div>
            <div class="m-4">
                <button class="btn btn-primary m-2" @click="next()">Clear Highlighted</button>
                <button class="btn btn-danger m-2" @click="audience()">Next Audience</button>
            </div>
            <div>
                <button class="btn btn-primary m-2" @click="toggleVoting()">Enable Voting</button>
                <button class="btn btn-primary m-2" @click="toggleResults()">Enable Results</button>
            </div>
            <div>
                <button class="btn btn-small btn-danger m-2" @click="reset()">Reset</button>
            </div>
            <div v-if="nextAudienceVote">
                Next Audience Score: {{nextAudienceVote.id}} - {{nextAudienceVote.score}}
            </div>
        </div>  
    </div>
</template>

<script>
    import countries from '../../../json/countries'
    export default {
        name: "",
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
            bottomSeven(name) {
                this.$emit('bottom-seven',name);
            },
            top(name) {
                this.$emit('top',name);
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
            }
        }
    }
</script>

<style scoped>

</style>