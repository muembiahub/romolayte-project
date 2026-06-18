 import  {supabase} from "../config/database.js"
 
export const insertDemandeService = async ({
  category_id,
  service_id,
  category_name,
  service_name,
  price,
  name,
  email,
  coordinates,
  location,
  phone,
  gender,
  other_info,
  status = "Reçus",
}) => {
  try {

    const { data, error } = await supabase
      .from("demande_service")
      .insert([
        {
          category_id,
          service_id,
          category_name,
          service_name,
          price,
          name,
          email,
          coordinates,
          location,
          phone,
          gender,
          other_info,
          status,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "SUPABASE ERROR:",
        error
      );

      throw error;
    }

    return data;

  } catch (err) {
    console.error(
      "MODEL ERROR:",
      err
    );

    throw err;
  }
};