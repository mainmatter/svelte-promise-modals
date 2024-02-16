<script>
  import { useModalContext } from '$lib';

  let { openModal } = useModalContext();
</script>

<slot {openModal} />
