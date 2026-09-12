import { requirementEvidence, requirementEvidenceLabels, status } from "./content";

/** Text remains selectable and readable at narrow widths; colour never carries status alone. */
export default function RequirementEvidence() {
  return (
    <div className="ph-requirement-evidence">
      <h3>{status.checklist.label}</h3>
      <p className="ph-evidence-intro">{status.checklist.caption}</p>
      <ul className="ph-evidence-legend" aria-label="Evidence types">
        {Object.entries(requirementEvidenceLabels).map(([kind, label]) => (
          <li key={kind} data-evidence={kind}>{label}</li>
        ))}
      </ul>
      <table className="ph-evidence-table">
        <caption className="sr-only">Current evidence for the eighteen design requirements</caption>
        <thead><tr><th scope="col">Requirement</th><th scope="col">Evidence status</th><th scope="col">Basis and limits</th></tr></thead>
        <tbody>
          {requirementEvidence.map((row) => (
            <tr key={row.requirement}>
              <th scope="row">{row.requirement}</th>
              <td><span data-evidence={row.kind}>{requirementEvidenceLabels[row.kind]}</span></td>
              <td>{row.basis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
