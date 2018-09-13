import axios from 'axios';
import getTargetUrls from './getTargetUrls';

export default async function findTargets(sourceUrl) {
  let response;
  try {
    response = await axios.get(sourceUrl);
  } catch (err) {
    throw err;
  }
  try {
    const pageContent = await response.data;
    return await getTargetUrls(pageContent, sourceUrl);
  } catch (error) {
    console.log('Error finding target urls:', error.message);
    return [];
  }
}
