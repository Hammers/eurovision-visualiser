<template>
    <div class="container-fluid d-flex align-items-center justify-content-center">
        <div class="row justify-content-center align-items-center w-100">
            <div class="card col-10 col-lg-6 form-inline">
                <div class="form-group">
                    <label for="nameInput" class="m-3">Your Name</label>
                    <input type="text" class="form-control" id="nameInput" placeholder="Jon Ola Sand" v-model="votes.name">
                </div>
                <div v-for="(vote,index) in votes.selected" :key="index">
                    <div class="form-group" v-if="votes.selected[index] === ''">
                        <label :for="'vote' + index" class="m-3">{{points[index]}} Points</label>
                        <select class="form-control" :id="'vote' + index" v-model="votes.selected[index]">
                            <option v-for="country in availableCountries()" :value="country.id" :key="country.id">{{country.number + ' - ' + country.name + ' - ' + country.artist +  ' - ' + country.song}}</option>
                        </select>
                    </div>
                    <div class="form-group"  v-else>
                        <label :for="'vote' + index" class="m-3">{{points[index]}} Points:</label>
                        <span :id="'vote' + index">{{countries.find(x => x.id === votes.selected[index]).name}}</span>
                        <button class="btn btn-danger btn-sm mx-2" @click="removeVote(index)">X</button>
                    </div>
                </div>
                <button class="btn btn-primary btn-lg" v-if="votes.selected.every(x => x !== '') && votes.name !== ''" @click="submit">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
    import countries from '../../../json/countries'
    export default {
        name: "",
        data() {
            return {
                points: [12,10,8,7,6,5,4,3,2,1],
                votes: {
                    name: "",
                    selected: ["","","","","","","","","",""]
                },
                countries,
            }
        },

        methods: {
            availableCountries() {
                let available = [];
                for(let i=0; i < countries.length; i++)
                {
                    if(!this.votes.selected.includes(countries[i].id)){
                        available.push(countries[i]);
                    }
                }
                return available;
            },
            removeVote(index){
                console.log(index);
                this.votes.selected[index] = '';
                this.$forceUpdate();
            },
            submit() {
                console.log(this.votes);
                this.$emit('submit-votes',this.votes);
                localStorage.vote2020 = true;
                this.$router.push("/");
            }
        }
    }
</script>

<style scoped>
    .list-enter-active,
    .list-leave-active,
    .list-move {
        transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
        transition-property: opacity, transform;
    }

    .list-enter {
        opacity: 0;
        transform: translateX(50px) scaleY(0.5);
    }

    .list-enter-to {
        opacity: 1;
        transform: translateX(0) scaleY(1);
    }

    .list-leave-active {
        position: absolute;
    }

    .list-leave-to {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: center top;
    }

    .viewer {
        height: 700px;
    }

    .country-box {
        font-family: 'Montserrat';
        text-transform: uppercase;
        vertical-align: middle;
        font-size: 4vh;
        height: 7vh;
    }

    .unselected {
        background: rgb(21, 34, 109);
    }

    .selected {
        background: rgb(5,60,172);
        background: linear-gradient(90deg, rgba(5,60,172,1) 0%, rgba(14,50,186,1) 17%, rgba(12,186,255,1) 100%);
    }

    .number-box {
        height: 7vh;
        width: 15vh;
        font-size: 7vh;
    }

    .other {
        background: rgb(110, 196, 240);
    }

    .first {
        background: rgb(240, 207, 75);
    }

    .second {
        background: rgb(175, 173, 174);
    }

    .third {
        background: rgb(162, 105, 49);
    }

    .flag {
        height: 5.5vh;
        width: 10vh;
    }
</style>