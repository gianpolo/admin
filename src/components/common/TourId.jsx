export default function TourId({ tourId, experienceId, optionId }) {
  if (tourId) {
    experienceId = tourId.experienceId;
    optionId = tourId.optionId;
  }
  return (
    <span className="text-xs">
      [{experienceId},{optionId}]
    </span>
  );
}
