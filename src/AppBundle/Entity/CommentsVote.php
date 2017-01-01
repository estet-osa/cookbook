<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Entity
 * @ORM\Table(name="comment_votes")
 */
class CommentsVote
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Comments", inversedBy="votes")
     * @ORM\JoinColumn(name="comment_id", referencedColumnName="id")
     */
    protected $entry;

    /**
     * @ORM\Column(type="string", columnDefinition="CHAR(2) NULL")
     */
    protected $user_vote;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     */
    protected $client_id;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set userVote
     *
     * @param string $userVote
     *
     * @return CommentsVote
     */
    public function setUserVote($userVote)
    {
        $this->user_vote = $userVote;

        return $this;
    }

    /**
     * Get userVote
     *
     * @return string
     */
    public function getUserVote()
    {
        return $this->user_vote;
    }

    /**
     * Set clientId
     *
     * @param string $clientId
     *
     * @return CommentsVote
     */
    public function setClientId($clientId)
    {
        $this->client_id = $clientId;

        return $this;
    }

    /**
     * Get clientId
     *
     * @return string
     */
    public function getClientId()
    {
        return $this->client_id;
    }

    /**
     * Set entry
     *
     * @param \AppBundle\Entity\Comments $entry
     *
     * @return CommentsVote
     */
    public function setEntry(\AppBundle\Entity\Comments $entry = null)
    {
        $this->entry = $entry;

        return $this;
    }

    /**
     * Get entry
     *
     * @return \AppBundle\Entity\Comments
     */
    public function getEntry()
    {
        return $this->entry;
    }
}
