<script>
  import { useModalContext } from '$lib/service';

  let { openModal } = useModalContext();
</script>

<slot {openModal} />
