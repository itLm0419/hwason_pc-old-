<template>
    <div>
      <!--三种状态-->
      <!--reject-->
      <div v-if="state ==='reject'">
        <modify-medical :id="id"></modify-medical>
      </div>

      <!--pending-->
      <div v-if="state ==='pending'">
        <medical-detail></medical-detail>
      </div>

      <!--pass-->
      <div v-if="state ==='pass'">
        <create-account></create-account>
      </div>
    </div>
</template>
<script>
  import medicalDetail from './medicalDetail.vue'
  import modifyMedical from './modifyMedical.vue'
  import createAccount from './createAccount.vue'

	export default {
    components: {
      medicalDetail,
      modifyMedical,
      createAccount
    },
		data() {
			return {
        state: 'pending',
        id: ''
      }
		},
		methods: {

    },
    mounted() {

    },
    created() {
      let vm = this;

      let urlSearch = new vm.api.UrlSearch();

      vm.state = urlSearch.state;

      vm.id = urlSearch._id;
    }
	}
</script>
<style>

</style>
