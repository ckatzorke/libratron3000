<template>
  <div class="loanstatus">
    <lib-loanlist/>
  </div>
</template>

<script>
import LoanList from '@/components/LoanList'
export default {
  components: {
    'lib-loanlist': LoanList
  }
}
</script>
