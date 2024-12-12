interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
}

export const addLeads = (leads: Lead[]): void => {
  const existingLeads = getLeads();
  const newLeads = leads.filter((lead) => !existingLeads.some((e) => e.email === lead.email));

  localStorage.setItem('leads', JSON.stringify([...existingLeads, ...newLeads]));
};

export const getLeads = (): Lead[] => {
  return JSON.parse(localStorage.getItem('leads') || '[]');
};

export const deleteLead = (id: string): void => {
  const existingLeads = getLeads();
  const updatedLeads = existingLeads.filter((lead) => lead.id !== id);
  localStorage.setItem('leads', JSON.stringify(updatedLeads));
};

export const detectDuplicates = (leads: Lead[]): { uniqueLeads: Lead[], duplicateCount: number } => {
  const existingLeads = getLeads();
  const uniqueLeads = leads.filter((lead) => !existingLeads.some((e) => e.email === lead.email));
  const duplicateCount = leads.length - uniqueLeads.length;
  return { uniqueLeads, duplicateCount };
};