import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div id='privacy-policy' className="privacy-policy-container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">PRIVACY POLICY</h1>
      <p className="mb-6"><em>Last Updated on: 14th June 2025</em></p>
      
      <div className="mb-8">
        <p className="mb-4">
          At ND Diagnostics India Pvt. Ltd. ("ND Diagnostics", "we", "us", or "our"), protecting the privacy of our customer is of paramount importance. This Privacy Policy ("Policy") outlines how we collect, store, use, disclose, and transfer your personal and sensitive personal data in compliance with applicable Indian data privacy laws including the Information Technology Act, 2000 and associated rules.
        </p>
        <p className="mb-4">
          We encourage you to review this page periodically to stay informed about any changes to the Policy. We value your trust and therefore maintain the highest standards of security for your personal information.
        </p>
        <p className="mb-4">
          This Policy applies to all individuals availing visa medical services for Australia or interacting with our website, digital interfaces, mobile applications, and any physical facilities operated by ND Diagnostics across India ("Services").
        </p>
        <p className="mb-4">
          By accessing our services or providing us with your personal data, you consent to the practices described in this Policy. We will not disclose or sell any of your personal information, including your name, address, age, sex or medical history to any third party without your permission.
        </p>
        <p className="mb-4">
          Although we use cookie technology to help users navigate our site efficiently, we never use cookies to store personal information, such as credit card numbers. Please be aware, however, that our site contains link to other sites and that the privacy practices of other sites may differ from those of ND diagnostics. If you have any additional questions or concerns regarding our privacy policies, please email us at <a href="mailto:info@ndhealthcheck.com" className="text-blue-600">info@ndhealthcheck.com</a>
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. DEFINITIONS</h2>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border text-left">Term</th>
              <th className="p-3 border text-left">Definition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border font-semibold">"Personal Data"</td>
              <td className="p-3 border">information relating to an identified or identifiable individual, including but not limited to name, date of birth, contact details, and passport information</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-3 border font-semibold">"Sensitive Personal Data or Information" (SPDI)</td>
              <td className="p-3 border">refers to information related to health status, biometric data, medical history, and other categories defined under the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</td>
            </tr>
            <tr>
              <td className="p-3 border font-semibold">"Data Subject"/ "You"</td>
              <td className="p-3 border">the individual whose data is collected and processed by ND Diagnostics.</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-3 border font-semibold">"Processing"</td>
              <td className="p-3 border">refers to any operation performed on Personal Data, whether automated or manual, including collection, recording, storage, use, sharing, or erasure.</td>
            </tr>
            <tr>
              <td className="p-3 border font-semibold">"Third Parties"</td>
              <td className="p-3 border">Refers to any authorized government agencies, consular entities, service providers, diagnostic laboratories, or logistics partners or similar entities.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. PURPOSE OF DATA COLLECTION</h2>
        <p>ND Diagnostics collects and processes your Personal Data to provide better services.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. TYPES OF DATA COLLECTED</h2>
        <p className="mb-4">We may collect the following categories of data:</p>
        
        <h3 className="text-xl font-semibold mb-2">4.1. Personal Data</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Full name, gender, age, nationality</li>
          <li>Contact details: phone number, email address, residential address</li>
          <li>Passport or travel document details</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-2">4.2. Sensitive Personal Data</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Medical history and diagnostic results</li>
          <li>Biometric data (e.g., fingerprint, photographs)</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-2">4.3. Transactional and Usage Data</h3>
        <ul className="list-disc pl-6">
          <li>Payment method and transaction records</li>
          <li>IP address, device information, and cookies (for digital interaction)</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. LEGAL BASIS FOR PROCESSING</h2>
        <p className="mb-4">We process Personal and Sensitive Personal Data on one or more of the following lawful grounds:</p>
        <ul className="list-disc pl-6">
          <li><strong>Consent:</strong> When you have explicitly agreed to data processing.</li>
          <li><strong>Legal Obligations:</strong> To comply with applicable legal and regulatory requirements.</li>
          <li><strong>Contractual Necessity:</strong> Where the processing is necessary to perform a contract to which you are a party, or to take steps at your request prior to entering a contract.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">6. DATA SHARING AND DISCLOSURES</h2>
        <p className="mb-4">We may share your data with:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>government and immigration authorities (e.g., Australian consular offices);</li>
          <li>Partner diagnostic centres and laboratories involved in test processing;</li>
          <li>Payment gateways and financial institutions;</li>
          <li>Third-party IT service providers who assist in data storage and hosting;</li>
          <li>Legal or regulatory authorities upon valid request or as mandated under law.</li>
        </ul>
        <p>We do not sell or rent your personal information to any third party for marketing or other purposes.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">8. SECURITY MEASURES</h2>
        <p className="mb-4">We implement commercially reasonable and industry-standard safeguards to protect your data, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Data encryption (in transit and at rest)</li>
          <li>Role-based access control and authentication</li>
          <li>Secure servers and firewalls</li>
          <li>Regular security audits and vulnerability assessments</li>
        </ul>
        <p>While we take appropriate measures to safeguard your information, no method of transmission over the Internet or electronic storage is fully secure. You accept this risk by using our services.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">9. YOUR RIGHTS</h2>
        <p className="mb-4">As a Data Subject, under the Indian law you have the following rights:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Request access to your personal information.</li>
          <li>Request corrections or rectification of your data.</li>
          <li>Withdraw consent at any time.</li>
          <li>Request data portability.</li>
          <li>Request deletion of your data, subject to legal exceptions.</li>
        </ul>
        <p>All requests must be made in writing to the Data Protection Officer (details below).</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">10. COOKIES AND TRACKING</h2>
        <p className="mb-4">
          Our website uses cookies to improve user experience. Cookies help analyse user behaviour and personalize content. You may choose to disable cookies through your browser settings; however, please note that certain features of our website may not function properly as a result.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">11. CROSS-BORDER DATA TRANSFERS</h2>
        <p>Given the nature of our services, we may transfer your data to entities or authorities located outside India, subject to applicable data protection safeguards.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">13. UPDATES TO THIS POLICY</h2>
        <p className="mb-4">
          We may update this Privacy Policy periodically. Updates will be posted on our website with the effective date. Continued use of our services indicates acceptance of the revised Policy.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">14. GOVERNING LAW AND JURISDICTION</h2>
        <p>This Policy shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts located in New Delhi, India.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">15. CONTACT US</h2>
        <p className="mb-4">If you have any questions, concerns, or wish to exercise your data protection rights, please contact:</p>
        <address className="not-italic">
          <p className="font-semibold">Data Protection Officer</p>
          <p>ND Diagnostics India Pvt. Ltd.</p>
          <p>Corporation Door No. 61/2145 C1, CUC Ventures Coastal Chambers, M.G. Road, Kochi, Ernakulam District, Kerala – 682015</p>
          <p>Name : Mr. Sunil Yadav</p>
          <p>Email: info@ndhealthcheck.com</p>
          <p>Phone: 9582-116116</p>
        </address>
      </div>

     
    </div>
  );
};

export default PrivacyPolicy;