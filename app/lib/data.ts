import { sql } from '@vercel/postgres';
import {
  NewslatterPayload,
  NewslatterType,
  User,
  UserSelectType,
} from './definitions';

export async function getUserByEmail(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const insertNewslatter = async (
  payload: NewslatterPayload,
): Promise<boolean> => {
  const { file, title, userId, recipientIds } = payload;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const resultNewsletter = await sql`
    INSERT INTO Newsletter (title, fileNewsletter, createdBy)
    VALUES (${title}, ${buffer.toString()}, ${userId}) RETURNING id
  `;

  const newsletterId = resultNewsletter.rows?.[0]?.id;

  for (const recipient of recipientIds) {
    const result = await sql`
    INSERT INTO User_Newsletter (userId, NewsletterId)
    VALUES (${recipient}, ${newsletterId})
  `;
   
  }

  return true;
};

export const getAllUser = async (): Promise<Array<UserSelectType>> => {
  try {
    const user = await sql`SELECT id, name, email FROM users`;
    return user.rows as Array<UserSelectType>;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
};

export const getRoleUserById = async (id: string): Promise<boolean> => {
  try {
    const user = await sql`SELECT isAdmin FROM users WHERE id=${id}`;
    if (!user.rows) return false;

    return user.rows[0]?.isadmin as boolean;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
};

export const getNewslattersByRole = async (
  isAdmin: boolean,
  userId: string,
): Promise<Array<NewslatterType> | null> => {
  try {
    if (isAdmin) {
      const newsletterQuery = await sql`
        SELECT newsletter.id, title, filenewsletter as file,
          (
                SELECT json_agg(jsonb_build_object(
                    'id', users.id,
                    'name', users.name,
                    'email', users.email
                ))
                FROM users 
                JOIN user_newsletter ON newsletter.id = user_newsletter.NewsletterId
                WHERE users.id = user_newsletter.userId
            ) AS recipients
               FROM newsletter
              WHERE newsletter.createdBy = ${userId}
            `;
      console.log(newsletterQuery?.rows as Array<NewslatterType>);
      return newsletterQuery?.rows as Array<NewslatterType>;
    }

    const newsletteRrecipient = await sql`
            SELECT newsletter.id, title, users.name as createdName, fileNewsletter as file
            FROM user_newsletter 
            JOIN newsletter ON newsletter.id= user_newsletter.newsletterId
            JOIN users ON users.id = newsletter.createdby
            WHERE user_newsletter.userid = ${userId}
    `;

    return newsletteRrecipient.rows as Array<NewslatterType>;
  } catch (error) {
    console.error('Failed to fetch newslatters:', error);
    throw new Error('Failed to fetch newslatters.');
  }
};

export const deleteNewsletter = async (newsletteId: string, userId: string) => {
  try {
    const resultDelete = await sql`
     DELETE FROM  user_newsletter
     WHERE userid=${userId} and newsletterId= ${newsletteId}
    `;
    return Boolean(resultDelete?.rowCount);
  } catch (error) {
    console.error('Failed to delete newslatters by user:', error);
    throw new Error('Failed to delete newslatters by user.');
  }
};

export const sendEmail = async (formData: FormData) => {
  try {
    const url = `${process.env.APP_URL}/api/send`;

    const result = await fetch(url, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCountNewsLatter = async (): Promise<number> => {
  try {
    const result = await sql`
        SELECT COUNT(id) FROM newsletter
        `;

    return result.rows?.[0]?.count as number;
  } catch (error) {
    console.error('Failed to delete newslatters by user:', error);
    throw new Error('Failed to delete newslatters by user.');
  }
};
