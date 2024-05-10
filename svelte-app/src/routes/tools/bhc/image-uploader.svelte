
<script>
	import pb from "$lib/pb";
  export let lotNumber = 'null'
  export let rackId = '' 
  let uploadProgress;
  let fileInput;
  let uploading = false
 async function uploadFile (e) {
        const formData = new FormData();
        formData.append("proof", e.target.files[0], lotNumber + ".jpg" )


        const xhr = new XMLHttpRequest();
        const success = await new Promise((resolve) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              uploadProgress.value = (event.loaded / event.total) * 100;
            }
          });

          xhr.addEventListener("loadend", () => {
            uploading = false
            fileInput.value = ''
            resolve(xhr.readyState === 4 && xhr.status === 200);
          });
          xhr.open("PATCH", '/api/collections/racks/records/' + rackId, true);
          xhr.setRequestHeader("Authorization", pb.authStore.token);
          xhr.send(formData);
          uploading = true
        });
        console.log("success:", success);
  } 
  function nanoid() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
  const randomStr = Math.random().toString(36).slice(2, 5); // Generate random string
  return timestamp + randomStr; // Concatenate timestamp and random string
}
</script>
{#if uploading}
<progress bind:this={uploadProgress} class="progress progress-info w-full" value="0" max="100"></progress>
{/if}
<input bind:this={fileInput} type="file" on:change={uploadFile} class="file-input file-input-bordered file-input-accent w-full" />
