import axios from 'axios';
import getTargetUrls from './getTargetUrls';

export default async function findTargets(sourceUrl) {
  try {
    const response = await axios.get(sourceUrl);
    const pageContent = await response.data;
    return await getTargetUrls(pageContent, sourceUrl);
  } catch (error) {
    console.log(error);
  }
}
