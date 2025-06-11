import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const footerLinks = [
  {
    title: "ONLINE SHOPPING",
    links: [
      "Men",
      "Women",
      "Kids",
      "Home & Living",
      "Beauty",
      "Gift Card",
      "Myntra Insider",
    ],
  },
  {
    title: "USEFUL LINKS",
    links: [
      "Contact Us",
      "FAQ",
      "T&C",
      "Terms of Use",
      "Track Orders",
      "Shipping",
      "Cancellation",
    ],
  },
  {
    title: "CUSTOMER POLICIES",
    links: ["Returns", "Privacy Policy", "Grievance Officer"],
  },
];

const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-5 border-top">
      <Container>
        <Row>
          {footerLinks.map((col, idx) => (
            <Col key={idx} xs={12} md={4} className="mb-3">
              <h5>{col.title}</h5>
              <ul className="list-unstyled">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-decoration-none text-dark">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
        <hr />
        <div className="text-center small text-muted">
          © 2025 www.myntra.com. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
