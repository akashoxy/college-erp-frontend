export const cleanupBlobUrl = (
  preview
) => {

  if (
    preview &&
    typeof preview === "string" &&
    preview.startsWith("blob:")
  ) {

    URL.revokeObjectURL(
      preview
    );

  }

};