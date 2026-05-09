import { CommunityAPI } from './storage';

// Find community by tag name
export const findCommunityByTag = (tag) => {
  const allCommunities = CommunityAPI.getAllCommunities();
  return allCommunities.find(
    (comm) =>
      comm.name.toLowerCase().includes(tag.toLowerCase()) ||
      comm.name.toLowerCase().includes(tag.toLowerCase().split('&')[0].trim())
  );
};

// Get link for a tag (community or tag page)
export const getTagLink = (tag) => {
  const matchingCommunity = findCommunityByTag(tag);
  return matchingCommunity ? `/community/${matchingCommunity.id}` : `/tag/${tag}`;
};
