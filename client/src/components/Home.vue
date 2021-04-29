<template>
    <div class="home-body text-center">
    <div class="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <main role="main" class="inner cover" >
            <img src="VirtualEurovisionLogo.png" alt="" class="w-100">
            <h1 class="cover-heading">Good Evening Europe!</h1>
            <p class="lead">Here you will be able to submit your votes as well as watch the results be revealed live!</p>
            <p class="lead" v-if="!resultsEnabled">
                <span v-if="voted">Thanks for voting!</span>
                <span v-else>
                    <span v-if="!votingEnabled">Voting will open after all acts have performed</span>
                    <button class="btn btn-lg btn-primary" @click="vote" v-else>Submit Votes</button>
                </span>
            </p>
            <p class="lead" v-else>
                <a href="#" class="btn btn-lg btn-primary" @click="results">View Results</a>
            </p>
        </main>
        
    </div>
    </div>
</template>

<script>
    export default {
        name: "",
        props: ["totals", "current", "audienceMode", "votingEnabled", "resultsEnabled"],
        data() {
            return {
                voted: false
            }
        },
        mounted() {
            if(localStorage.vote2021)
            {
                this.voted = true;
            }
        },
        methods: {
            vote() {
                this.$router.push("/vote")
            },
            results() {
                this.$router.push("/results")
            }
        }
    }
</script>

<style scoped>
    

    .home-body {
        color: #fff;
    }

    .cover-container {
        max-width: 42em;
    }
    
    .cover {
        padding: 0 1.5rem;
    }
    .cover .btn-lg {
        padding: .75rem 1.25rem;
        font-weight: 700;
    }
</style>