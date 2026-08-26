import { supabase } from './supabaseClient';

export const uploadMaterial = async (teacherId, file, module, title) => {
  try {
    // 1. Upload the file to the course_materials bucket
    const fileExt = file.name.split('.').pop();
    const fileName = `${teacherId}_${Math.random()}.${fileExt}`;
    const filePath = `${module}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('course_materials')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('course_materials')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Determine if it's an image or video
    let fileType = 'image';
    if (file.type.startsWith('video/')) {
      fileType = 'video';
    }

    // 4. Save the record in the study_materials table
    const { data: dbData, error: dbError } = await supabase
      .from('study_materials')
      .insert([
        {
          teacher_id: teacherId,
          module: module,
          title: title,
          file_url: publicUrl,
          file_type: fileType
        }
      ]);

    if (dbError) throw dbError;

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading material:', error.message);
    return { success: false, error: error.message };
  }
};

export const fetchMaterials = async (module) => {
  try {
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .eq('module', module)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching ${module} materials:`, error.message);
    return [];
  }
};

export const deleteMaterial = async (materialId) => {
  try {
    const { error } = await supabase
      .from('study_materials')
      .delete()
      .eq('id', materialId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting material:', error.message);
    return false;
  }
};
