<template>
    <div class="container d-flex align-items-center justify-content-center mt-5 text-light">
        <div class="row justify-content-center align-items-center w-100">
            <div class="col-12 col-lg-8 form-inline w-100 justify-content-center">
                <div class="d-flex form-group justify-content-center">
                    <label for="nameInput" class="m-3">Your Name</label>
                    <input type="text" class="form-control" id="nameInput" placeholder="Enter name..." v-model="votes.name">
                    <span class="small-text w-25 m-3"> Ryan will use this to work out who's votes are who's so please make sure this is something recognisable! (It's not stored anywhere and only Ryan will see it)</span>
                </div>
                <div class="country-box m-1 w-100 text-light d-flex align-items-center" :class="{'selected': votes.selected[index] !== '', 'unselected': votes.selected[index] === ''}" v-for="(vote,index) in votes.selected" :key="index">
                    <div class="number-box mr-3 d-flex align-items-center justify-content-center text-center" :class="getNumberClass(index)">
                        <span class="align-middle">{{points[index]}}</span>
                    </div>
                    <div class="form-group" v-if="votes.selected[index] === ''">
                        <select class="custom-select d-block w-100" :id="'vote' + index" v-model="votes.selected[index]">
                            <option v-for="country in availableCountries()" :value="country.id" :key="country.id">{{country.number + ' - ' + country.name + ' - ' + country.artist +  ' - ' + country.song}}</option>
                        </select>
                    </div>
                    <div v-else>
                        <div class="flex-grow-1">
                            {{countries.find(x => x.id === votes.selected[index]).name}}
                            <button class="btn btn-danger btn-sm mx-2" @click="removeVote(index)">X</button>
                        </div>
                        
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <button class="btn btn-primary btn-lg" :disabled="!votes.selected.every(x => x !== '') || votes.name === ''" @click="submit">Submit</button>
                </div>
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
                localStorage.vote2021 = true;
                this.$router.push("/");
            },
            getNumberClass(index) {
                switch(index) {
                    case 0 : return "first";
                    case 1 : return "second";
                    case 2 : return "third";
                    default : return "other";
                }
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
        font-size: 3vh;
        height: 6.5vh;
    }

    .unselected {
        background: rgb(21, 34, 109);
    }
    
    .selected {
        background: rgb(5,60,172);
        background: linear-gradient(90deg, rgba(5,60,172,1) 0%, rgba(14,50,186,1) 17%, rgba(12,186,255,1) 100%);
    }
    
    .number-box {
        height: 6.5vh;
        width: 15vh;
        font-size: 6vh;
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
    .dropdown-menu {
        width: 80%;
    }
    .small-text {
        font-size: 0.7rem;
    }
</style>