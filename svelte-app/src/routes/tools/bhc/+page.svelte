<script>
// import {createBHCPDF} from "$lib/loadBHC.js"
	import pb from "$lib/pb";
// const pdfBin = createBHCPDF()
async function getPdfFileUrl(){
 const record = await pb.collection('pdfs').getFirstListItem('title="bhc"');
 return pb.getFileUrl(record, record.file)
}
</script>

 
    <div id="pdfContainer" style="width:100%">
  {#await getPdfFileUrl()}
    <span>...Loading</span>
{:then fileUrl}
      <embed id="pdfFile" src={fileUrl} type="application/pdf" width="100%" height="600px"/>
{/await}
   </div>
