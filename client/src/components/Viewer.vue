<template>
        <div class="container-fluid d-flex align-items-center justify-content-center">
            <div class="row justify-content-center align-items-center w-100">
                <div class="col-12 col-lg-5 my-0 mx-1 p-0">
                    <transition-group tag="div" name="list">
                        <div class="country-box m-1 w-100 text-light d-flex align-items-center" :class="{'selected': isSelected(country), 'unselected': !isSelected(country)}" v-for="country in sortedTotals.firstHalf" :key="country.name">
                            <img :src="'flags/' + country.flag" alt="" class="flag mx-4 my-2" v-if="!showNumberBox(country)">
                            <div class="number-box mr-3 d-flex align-items-center justify-content-center text-center" :class="getNumberClass(country)" v-if="showNumberBox(country)">
                                <span class="align-middle">{{getValue(country)}}</span>
                            </div>
                            <div class="flex-grow-1">
                                {{country.name}}
                            </div>
                            <div class=" mr-3">{{country.value}}</div>
                        </div>
                    </transition-group>
                </div>
                <div class="col-12 col-lg-5 my-0 mx-1 p-0">
                    <transition-group tag="div" name="list">
                        <div class="country-box m-1 w-100 text-light d-flex align-items-center" :class="{'selected': isSelected(country), 'unselected': !isSelected(country)}" v-for="country in sortedTotals.secondHalf" :key="country.name">
                            <img :src="'flags/' + country.flag" alt="" class="flag mx-4 my-2" v-if="!showNumberBox(country)">
                            <div class="number-box mr-3 d-flex align-items-center justify-content-center text-center" :class="getNumberClass(country)"  v-if="showNumberBox(country)">
                                <span class="align-middle">{{getValue(country)}}</span>
                            </div>
                            <div class="flex-grow-1">
                                {{country.name}}
                            </div>
                            <div class=" mr-3">{{country.value}}</div>
                        </div>
                    </transition-group>
                </div>
                <div class="col-2 d-flex justify-content-center text-light vote-text align-items-center">
                    <span class="vote-text-number mx-2">{{votesDisplayed}}</span> OF <span class="vote-text-number mx-2">{{totalVotes}}</span> COUNTRIES VOTING
                </div>
                <div class="col-7">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" :style="{width: votePercent + '%'}" :aria-valuenow="votePercent" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                </div>
            </div>
            
        </div>
</template>

<script>
    import countries from '../../../json/countries'
    export default { 
        name: "",
        props: ["totals","current","audienceMode","totalVotes","votesDisplayed"],
        data() {
            return {
                countries
            }
        },
        computed: {
            sortedTotals() {
                let list = [];
                for(var i = 0; i < countries.length; i++)
                {
                    list.push({id: countries[i].id, name: countries[i].name, value: this.totals[countries[i].id], flag: countries[i].flag});
                }
                list = list.sort((a,b) => {return b.value - a.value});
                let firstHalf = list.splice(0,list.length / 2);
                return {firstHalf,secondHalf: list}
            },
            votePercent() {
                return (this.votesDisplayed / this.totalVotes) * 100;
            }
        },
        methods: {
            isSelected(country) {
                
                return this.current.find(x => x.id === country.id);
            },
            showNumberBox(country) {
                if(this.audienceMode && this.current.length > 0) {
                    return this.current[0].id === country.id;
                }
                else return this.isSelected(country);
            },
            getValue(country) {
                let points = this.current.find(x => x.id === country.id);
                return points ? points.value : 0;
            },
            getNumberClass(country) {
                let value = this.getValue(country);
                if(value === 12) {
                    return "first";
                } else if(value === 10) {
                    return "second";
                } else if(value === 8) {
                    return "third";
                } else {
                    return "other";
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
        font-size: 3.5vh;
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
    
    .vote-text {
        font-size: 0.9rem;
    }

    .vote-text-number {
        font-size: 1.2rem;
    }
    
    .progress {
        background-color: rgb(21, 34, 109);
    }
    
    .progress-bar {
        background-color: rgb(110, 196, 240);
    }
</style>